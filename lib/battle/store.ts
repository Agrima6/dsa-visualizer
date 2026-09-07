// lib/battle/store.ts
//
// Redis-backed room state for Code Battle. A room is a single JSON blob
// keyed by its id, with a TTL so abandoned rooms clean themselves up
// instead of accumulating forever.
//
// Concurrency note: this does a plain read-modify-write against Redis,
// not a transaction. The only two writers of a given room are its two
// players, and they're only ever writing distinct parts of the state
// (their own submissions) at distinct times (you can't submit until it's
// your move to make), so a real race is unlikely in practice for an MVP —
// but it is a real gap if this ever needs to be airtight (the fix would
// be an optimistic-lock version field, or Upstash's WATCH-less Lua
// scripting for a true compare-and-swap).

import { getRedis } from "@/lib/redis"
import { pickBattleQuestions, getBattleProblem } from "./problems"
import type { BattleConfig, BattlePlayer, BattleRoom, BattleRoomView, PlayerSubmission } from "./types"

const ROOM_TTL_SECONDS = 3 * 60 * 60 // 3 hours — long enough for a slow invite-link pickup, short enough not to pile up
const roomKey = (id: string) => `battle:room:${id}`

function generateRoomId(): string {
  // Short, URL-friendly, and unambiguous enough to type by hand if
  // someone reads an invite code aloud instead of clicking the link.
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ" // no 0/O/1/I/L
  let id = ""
  for (let i = 0; i < 6; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)]
  return id
}

export async function createRoom(hostUserId: string, hostName: string, config: BattleConfig): Promise<BattleRoom> {
  const redis = getRedis()
  const questionSlugs = pickBattleQuestions(config, config.numQuestions)

  const room: BattleRoom = {
    id: generateRoomId(),
    config,
    questionSlugs,
    status: "waiting",
    hostUserId,
    players: {
      [hostUserId]: makePlayer(hostUserId, hostName),
    },
    createdAt: Date.now(),
    startedAt: null,
    finishedAt: null,
    winnerUserId: null,
  }

  await redis.set(roomKey(room.id), JSON.stringify(room), { ex: ROOM_TTL_SECONDS })
  return room
}

function makePlayer(userId: string, name: string): BattlePlayer {
  return {
    userId,
    name,
    joinedAt: Date.now(),
    submissions: [],
    currentQuestion: 0,
    solvedCount: 0,
    totalTimeMs: 0,
    finishedAt: null,
  }
}

export async function getRoom(id: string): Promise<BattleRoom | null> {
  const redis = getRedis()
  const raw = await redis.get<BattleRoom | string>(roomKey(id))
  if (!raw) return null
  // Upstash's client auto-parses JSON values in some configurations and
  // not others depending on how they were set — handle both.
  return typeof raw === "string" ? JSON.parse(raw) : raw
}

async function saveRoom(room: BattleRoom): Promise<void> {
  const redis = getRedis()
  await redis.set(roomKey(room.id), JSON.stringify(room), { ex: ROOM_TTL_SECONDS })
}

export type JoinResult =
  | { ok: true; room: BattleRoom }
  | { ok: false; error: string }

export async function joinRoom(id: string, userId: string, name: string): Promise<JoinResult> {
  const room = await getRoom(id)
  if (!room) return { ok: false, error: "Battle not found — the invite link may have expired." }

  if (room.players[userId]) {
    // Already in this room (host reloading the page, or a reconnect) — no-op.
    return { ok: true, room }
  }

  const playerCount = Object.keys(room.players).length
  if (playerCount >= 2) {
    return { ok: false, error: "This battle already has two players." }
  }

  room.players[userId] = makePlayer(userId, name)
  room.status = "active"
  room.startedAt = Date.now()
  await saveRoom(room)
  return { ok: true, room }
}

export type SubmitResult =
  | { ok: true; room: BattleRoom; submission: PlayerSubmission }
  | { ok: false; error: string }

export async function recordSubmission(
  roomId: string,
  userId: string,
  questionIndex: number,
  submission: PlayerSubmission
): Promise<SubmitResult> {
  const room = await getRoom(roomId)
  if (!room) return { ok: false, error: "Battle not found." }
  if (room.status !== "active") return { ok: false, error: "This battle isn't active." }

  const player = room.players[userId]
  if (!player) return { ok: false, error: "You're not a player in this battle." }
  if (questionIndex !== player.currentQuestion) {
    return { ok: false, error: "That's not your current question." }
  }
  if (isTimeUp(room)) {
    return { ok: false, error: "Time's up." }
  }

  player.submissions.push(submission)

  if (submission.passed) {
    player.solvedCount += 1
    player.totalTimeMs += submission.submittedAt - (room.startedAt ?? submission.submittedAt)
    player.currentQuestion += 1
    if (player.currentQuestion >= room.questionSlugs.length) {
      player.finishedAt = submission.submittedAt
    }
  }

  maybeFinishRoom(room)
  await saveRoom(room)
  return { ok: true, room, submission }
}

function isTimeUp(room: BattleRoom): boolean {
  if (!room.startedAt) return false
  return Date.now() - room.startedAt > room.config.timeLimitSeconds * 1000
}

/** Mutates room.status/finishedAt/winnerUserId in place if the battle is over. */
function maybeFinishRoom(room: BattleRoom): void {
  const players = Object.values(room.players)
  const totalQuestions = room.questionSlugs.length

  const bothFinishedAll = players.length === 2 && players.every((p) => p.solvedCount >= totalQuestions)
  const timeUp = isTimeUp(room)

  if (!bothFinishedAll && !timeUp) return
  if (room.status === "finished") return

  room.status = "finished"
  room.finishedAt = Date.now()

  if (players.length < 2) {
    room.winnerUserId = players[0]?.userId ?? null
    return
  }

  const [a, b] = players
  if (a.solvedCount !== b.solvedCount) {
    room.winnerUserId = a.solvedCount > b.solvedCount ? a.userId : b.userId
  } else if (a.solvedCount === 0) {
    room.winnerUserId = null // neither solved anything — draw, not a time-based tiebreak
  } else if (a.totalTimeMs !== b.totalTimeMs) {
    room.winnerUserId = a.totalTimeMs < b.totalTimeMs ? a.userId : b.userId
  } else {
    room.winnerUserId = null // exact tie
  }
}

/** Forces the finished-check (e.g. time expiring with no new submission to trigger it) and persists if it flipped. */
export async function checkAndFinishIfTimeUp(roomId: string): Promise<BattleRoom | null> {
  const room = await getRoom(roomId)
  if (!room || room.status !== "active") return room
  if (!isTimeUp(room)) return room
  maybeFinishRoom(room)
  await saveRoom(room)
  return room
}

/** Builds the client-safe view of a room from one player's perspective. */
export function toRoomView(room: BattleRoom, viewerUserId: string): BattleRoomView {
  const me = room.players[viewerUserId] ?? null
  const opponentEntry = Object.values(room.players).find((p) => p.userId !== viewerUserId) ?? null

  const lastOpponentSubmission = opponentEntry?.submissions[opponentEntry.submissions.length - 1] ?? null

  return {
    id: room.id,
    config: room.config,
    status: room.status,
    hostUserId: room.hostUserId,
    startedAt: room.startedAt,
    finishedAt: room.finishedAt,
    winnerUserId: room.winnerUserId,
    totalQuestions: room.questionSlugs.length,
    me: me
      ? {
          userId: me.userId,
          name: me.name,
          currentQuestion: me.currentQuestion,
          solvedCount: me.solvedCount,
          totalTimeMs: me.totalTimeMs,
          lastSubmission: me.submissions[me.submissions.length - 1] ?? null,
        }
      : null,
    opponent: opponentEntry
      ? {
          userId: opponentEntry.userId,
          name: opponentEntry.name,
          currentQuestion: opponentEntry.currentQuestion,
          solvedCount: opponentEntry.solvedCount,
          totalTimeMs: opponentEntry.totalTimeMs,
          lastTestsPassed: lastOpponentSubmission?.testsPassed ?? null,
          lastTestsTotal: lastOpponentSubmission?.testsTotal ?? null,
        }
      : null,
  }
}

/** The current question's public-safe problem info (no test cases) for a room, from either player's side. */
export function currentPublicQuestion(room: BattleRoom, viewerUserId: string) {
  const me = room.players[viewerUserId]
  if (!me) return null
  const slug = room.questionSlugs[me.currentQuestion]
  if (!slug) return null
  const problem = getBattleProblem(slug)
  if (!problem) return null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- deliberately discarding testCases (the answer key) before this reaches the client
  const { testCases: _omit, ...publicProblem } = problem
  return publicProblem
}
