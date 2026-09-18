"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2, Pause, Play, RotateCcw, Sparkles, SkipBack, SkipForward } from "lucide-react"
import {
  runUserStackQueueCode,
  type StackQueueInputType,
  type StackQueueRunResult,
  type StackQueueStep,
} from "@/lib/code-playground/stack-queue-runner"
import { useTracePlayer } from "@/hooks/use-trace-player"
import { StackQueueDisplay } from "@/components/code-playground/stack-queue-display"
import { ShareButton } from "@/components/visualizer/shared/share-button"
import { decodeState } from "@/lib/share-state"
import { Reveal } from "@/components/motion/reveal"
import { ConstellationBackground } from "@/components/visualizer/shared/constellation-background"
import { Planet } from "@/components/visualizer/shared/planet"
import { Rows3, GitBranch, ListTree } from "lucide-react"

interface SharedStackQueuePlaygroundState {
  code: string
  input: string
  templateId?: string
}

const EMPTY_STEP: StackQueueStep = { kind: "stack", items: [], highlightedIds: [], message: "" }

interface Template {
  id: string
  label: string
  kind: "stack" | "queue"
  inputType: StackQueueInputType
  inputLabel: string
  defaultInput: string
  code: string
}

const TEMPLATES: Template[] = [
  {
    id: "valid-parentheses",
    label: "Valid Parentheses (Stack)",
    kind: "stack",
    inputType: "string",
    inputLabel: "Brackets to check",
    defaultInput: "([{}])",
    code: `function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(" || c === "[" || c === "{") {
      stack.push(c);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[c]) return false;
    }
  }
  return stack.length === 0;
}`,
  },
  {
    id: "next-greater-element",
    label: "Next Greater Element (Stack)",
    kind: "stack",
    inputType: "numberArray",
    inputLabel: "Comma-separated numbers",
    defaultInput: "4, 5, 2, 10, 8",
    code: `function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
  },
  {
    id: "generate-binary-numbers",
    label: "Generate Binary Numbers (Queue)",
    kind: "queue",
    inputType: "number",
    inputLabel: "How many numbers (N)",
    defaultInput: "5",
    code: `function generateBinaryNumbers(n) {
  const queue = [];
  const result = [];
  queue.push("1");
  for (let i = 0; i < n; i++) {
    const front = queue.shift();
    result.push(front);
    queue.push(front + "0");
    queue.push(front + "1");
  }
  return result;
}`,
  },
]

function parseInput(raw: string, type: StackQueueInputType): string | number[] | number | null {
  if (type === "string") return raw
  if (type === "number") {
    const n = parseInt(raw.trim(), 10)
    return isNaN(n) ? null : n
  }
  const nums = raw.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v))
  return nums.length > 0 ? nums : null
}

export default function StackQueueCodePlaygroundPage() {
  const [template, setTemplate] = useState<Template>(TEMPLATES[0])
  const [code, setCode] = useState(TEMPLATES[0].code)
  const [input, setInput] = useState(TEMPLATES[0].defaultInput)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StackQueueRunResult | null>(null)

  const player = useTracePlayer(result?.steps ?? [], EMPTY_STEP)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("p")
    if (!param) return
    const shared = decodeState<SharedStackQueuePlaygroundState>(param)
    if (!shared) return
    if (typeof shared.code === "string") setCode(shared.code)
    if (typeof shared.input === "string") setInput(shared.input)
    const t = TEMPLATES.find((tpl) => tpl.id === shared.templateId)
    if (t) setTemplate(t)
  }, [])

  const run = async () => {
    const parsed = parseInput(input, template.inputType)
    if (parsed === null) {
      setError(
        template.inputType === "number"
          ? "Enter a whole number."
          : template.inputType === "numberArray"
            ? "Enter comma-separated numbers."
            : "Enter some input."
      )
      return
    }
    setRunning(true)
    setError(null)
    setResult(null)
    try {
      const res = await runUserStackQueueCode(code, parsed, template.kind)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong running your code.")
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="relative z-0 container mx-auto space-y-8">
      <ConstellationBackground />
      <Reveal className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Code Playground — The Stack & Queue Realm
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Command Your Own Stack or Queue
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Write a function that uses a plain array as a stack or queue —{" "}
            <code className="rounded bg-muted px-1">.push</code>, <code className="rounded bg-muted px-1">.pop</code>,{" "}
            <code className="rounded bg-muted px-1">.shift</code>, <code className="rounded bg-muted px-1">.unshift</code> —
            and watch it animate.
          </p>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
            Runs entirely in your browser in a sandboxed worker. Only the <em>first</em> array your code
            pushes/pops/shifts/unshifts is tracked and animated — if your solution uses two separate
            stacks or queues, only the first one will show up here.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a href="/visualizer/code-playground" className="group flex items-center gap-2.5">
              <Planet theme="amber" size="sm"><Rows3 className="h-3.5 w-3.5" /></Planet>
              <span className="text-xs font-semibold text-violet-600 group-hover:underline dark:text-violet-300">← Array & Sorting Playground</span>
            </a>
            <a href="/visualizer/code-playground/tree" className="group flex items-center gap-2.5">
              <Planet theme="blue" size="sm"><GitBranch className="h-3.5 w-3.5" /></Planet>
              <span className="text-xs font-semibold text-violet-600 group-hover:underline dark:text-violet-300">Binary Tree Playground</span>
            </a>
            <a href="/visualizer/code-playground/linked-list" className="group flex items-center gap-2.5">
              <Planet theme="violet" size="sm"><ListTree className="h-3.5 w-3.5" /></Planet>
              <span className="text-xs font-semibold text-violet-600 group-hover:underline dark:text-violet-300">Linked List Playground →</span>
            </a>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your function
            </label>
            <select
              value={template.id}
              onChange={(e) => {
                const t = TEMPLATES.find((tpl) => tpl.id === e.target.value)
                if (t) {
                  setTemplate(t)
                  setCode(t.code)
                  setInput(t.defaultInput)
                  setResult(null)
                  setError(null)
                }
              }}
              className="rounded-lg border border-violet-500/15 bg-white/70 px-2 py-1 text-xs dark:bg-white/[0.04]"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-64 w-full resize-none rounded-xl border border-violet-500/15 bg-neutral-950 p-4 font-mono text-[13px] leading-relaxed text-emerald-300 outline-none focus:border-violet-500/40"
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={template.inputLabel}
            className="mt-4 w-full rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">{template.inputLabel}</p>

          <button
            onClick={run}
            disabled={running}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)] disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? "Running..." : "Run & Visualize"}
          </button>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-700 dark:text-rose-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
          {!result ? (
            <div className="flex h-full min-h-[280px] items-center justify-center text-center text-sm text-muted-foreground">
              Run your code to see it animate here.
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{result.operations}</strong> operations
                </span>
                <span className="text-xs text-muted-foreground">
                  Step {player.currentStep + 1}/{player.totalSteps}
                </span>
              </div>

              <div className="min-h-[220px] overflow-hidden rounded-xl border border-violet-500/10">
                <StackQueueDisplay kind={player.current.kind} items={player.current.items} highlightedIds={player.current.highlightedIds} />
              </div>
              <p className="mt-3 min-h-[1.25rem] text-sm text-muted-foreground">{player.current.message}</p>

              <div className="mt-4 flex items-center gap-2">
                <button onClick={player.reset} className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground" aria-label="Restart">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={player.prevStep} className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground" aria-label="Previous step">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button onClick={player.togglePlay} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2 text-sm font-semibold text-white">
                  {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {player.isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={player.nextStep} className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground" aria-label="Next step">
                  <SkipForward className="h-4 w-4" />
                </button>
                <ShareButton
                  state={{ code, input, templateId: template.id }}
                  paramName="p"
                  className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
