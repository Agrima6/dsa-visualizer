"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react"
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
import { CodeEditor } from "@/components/visualizer/shared/code-editor"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"
import { HintPanel } from "@/components/code-playground/hint-panel"
import { BLANKS_MESSAGE, hasBlanks } from "@/lib/code-playground/blanks"

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
  hints: string[]
  solution?: string
}

const TEMPLATES: Template[] = [
  {
    id: "guided-valid-parentheses",
    label: "Guided: Valid Parentheses (fill in the blanks)",
    kind: "stack",
    inputType: "string",
    inputLabel: "Brackets to check",
    defaultInput: "([{}])",
    hints: [
      "Every opening bracket must wait for its partner, so opening brackets go ON the stack.",
      "The name of the array method that adds an item to the end is push.",
      "A closing bracket must match the MOST RECENT opening one — that's the top of the stack, removed with pop.",
    ],
    solution: "stack.push(c);\n...\nstack.pop() !== pairs[c]",
    code: `function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(" || c === "[" || c === "{") {
      // Opening bracket: put it on the stack
      stack.___(c);
    } else {
      // Closing bracket: take the top off and check it matches
      if (stack.length === 0 || stack.___() !== pairs[c]) return false;
    }
  }
  return stack.length === 0;
}`,
  },
  {
    id: "valid-parentheses",
    label: "Valid Parentheses (Stack)",
    hints: [
      "Opening brackets are pushed; each closing bracket must match whatever is on top.",
      "If the stack is empty at the end, every bracket was matched.",
    ],
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
    hints: [
      "The stack holds indexes of numbers still waiting to find a bigger number to their right.",
      "When a new number is bigger than the one on top, pop it and record the new number as its answer.",
    ],
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
    hints: [
      "shift() takes from the FRONT of the array — that's a queue's dequeue.",
      "Each number produces two new ones by appending 0 and 1, which go to the back of the line.",
    ],
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

const DEFAULT_TEMPLATE = TEMPLATES.find((t) => t.id === "valid-parentheses")!

export function StackQueuePanel() {
  const [template, setTemplate] = useState<Template>(DEFAULT_TEMPLATE)
  const [code, setCode] = useState(DEFAULT_TEMPLATE.code)
  const [input, setInput] = useState(DEFAULT_TEMPLATE.defaultInput)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StackQueueRunResult | null>(null)
  const [speed, setSpeed] = useState(1)

  const player = useTracePlayer(result?.steps ?? [], EMPTY_STEP, 500 / speed)

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
    if (hasBlanks(code)) {
      setError(BLANKS_MESSAGE)
      return
    }
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="rounded-2xl border border-border bg-card p-5">
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
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <CodeEditor value={code} onChange={setCode} className="h-64" />
        <HintPanel hints={template.hints} solution={template.solution} resetKey={template.id} />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={template.inputLabel}
          className="mt-4 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40"
        />
        <p className="mt-1 text-[11px] text-muted-foreground">{template.inputLabel}</p>

        <button
          onClick={run}
          disabled={running}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
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
      <div className="rounded-2xl border border-border bg-card p-5">
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

            <SpeedControl speed={speed} onSetSpeed={setSpeed} className="mb-3" />

            <div className="min-h-[220px] overflow-hidden rounded-xl border border-border">
              <StackQueueDisplay kind={player.current.kind} items={player.current.items} highlightedIds={player.current.highlightedIds} />
            </div>
            <p className="mt-3 min-h-[1.25rem] text-sm text-muted-foreground">{player.current.message}</p>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={player.reset} className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Restart">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={player.prevStep} className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Previous step">
                <SkipBack className="h-4 w-4" />
              </button>
              <button onClick={player.togglePlay} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700">
                {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {player.isPlaying ? "Pause" : "Play"}
              </button>
              <button onClick={player.nextStep} className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Next step">
                <SkipForward className="h-4 w-4" />
              </button>
              <ShareButton
                state={{ code, input, templateId: template.id }}
                paramName="p"
                className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
