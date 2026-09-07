// lib/battle/types.ts
//
// Shared shapes for Code Battle (1v1 timed DSA duel). Room state lives in
// Redis (see store.ts) as a single JSON blob per room — rooms are short-
// lived (a couple of hours TTL) and only ever read/written by the two
// players in them, so there's no need for a relational store here.

export type BattleDifficulty = "Easy" | "Medium" | "Hard" | "Mixed"

export interface BattleTestCase {
  // Arguments passed to the player's function, in order.
  input: unknown[]
  expected: unknown
}

export interface BattleProblem {
  slug: string
  title: string
  difficulty: Exclude<BattleDifficulty, "Mixed">
  topic: string
  description: string
  constraints: string[]
  // The exact signature the player must implement — shown in the editor
  // as a starting point. Must be a single top-level function named
  // `solve` so the judge harness can call it uniformly across problems.
  starterCode: string
  // Shown to the player as worked examples.
  examples: { input: string; output: string }[]
  // Used for judging. Never sent to the client — see room/[roomId]/route.ts.
  testCases: BattleTestCase[]
}

export interface BattleConfig {
  difficulty: BattleDifficulty
  topics: string[] // empty array = any topic
  numQuestions: number
  timeLimitSeconds: number
}

export interface PlayerSubmission {
  questionIndex: number
  passed: boolean
  testsPassed: number
  testsTotal: number
  submittedAt: number
  error: string | null
  // The actual source submitted. Kept for the post-match replay/compare
  // feature — never sent to the opponent while the room is still active
  // (see toRoomView in store.ts); only surfaced once status is "finished",
  // the same moment a real contest would reveal everyone's solutions.
  code: string
}

export interface BattlePlayer {
  userId: string
  name: string
  joinedAt: number
  submissions: PlayerSubmission[]
  // Index of the question this player is currently attempting.
  currentQuestion: number
  // Count of fully-correct questions (their "score").
  solvedCount: number
  // Sum of (solved question's submit time - room startedAt), only over
  // solved questions — the tiebreaker when solvedCount is equal.
  totalTimeMs: number
  finishedAt: number | null
}

export type BattleStatus = "waiting" | "active" | "finished"

export interface BattleRoom {
  id: string
  config: BattleConfig
  questionSlugs: string[]
  status: BattleStatus
  hostUserId: string
  players: Record<string, BattlePlayer>
  createdAt: number
  startedAt: number | null
  finishedAt: number | null
  winnerUserId: string | null // null = draw (only meaningful once finished)
}

// What's actually sent to a client polling the room — strips the other
// player's code/submission errors down to public progress only, and never
// includes test case answers (those live server-side in problems.ts).
export interface BattleRoomView {
  id: string
  config: BattleConfig
  status: BattleStatus
  hostUserId: string
  startedAt: number | null
  finishedAt: number | null
  winnerUserId: string | null
  totalQuestions: number
  me: {
    userId: string
    name: string
    currentQuestion: number
    solvedCount: number
    totalTimeMs: number
    lastSubmission: PlayerSubmission | null
  } | null
  opponent: {
    userId: string
    name: string
    currentQuestion: number
    solvedCount: number
    totalTimeMs: number
    lastTestsPassed: number | null
    lastTestsTotal: number | null
  } | null
  // Populated only once status === "finished" — each player's final
  // attempt on each question they touched, code included, plus a safe
  // sample input to actually run that code against for the Compare
  // Approaches replay. Never present in "waiting"/"active" views.
  replay: {
    submissions: { userId: string; name: string; questionIndex: number; passed: boolean; code: string }[]
    sampleInputs: { questionIndex: number; slug: string; title: string; input: unknown[] }[]
  } | null
}
