// components/visualizer/recursion/hanoi-pegs-viz.tsx
// Derives the actual peg/disk state from the REAL move list a step has
// produced so far (problem.generateSteps()'s `result` field) — it replays
// the real moves rather than running a second, separate simulation, so
// this can never drift out of sync with the algorithm that's actually
// executing.

const MOVE_RE = /Move disk (\d+) from (\w) to (\w)/

function pegsAtStep(n: number, movesSoFar: string[]): Record<string, number[]> {
  const pegs: Record<string, number[]> = {
    A: Array.from({ length: n }, (_, i) => n - i), // [n, n-1, ..., 1], top = end
    B: [],
    C: [],
  }
  for (const move of movesSoFar) {
    const m = move.match(MOVE_RE)
    if (!m) continue
    const [, diskStr, from, to] = m
    const disk = Number(diskStr)
    const fromPeg = pegs[from]
    if (fromPeg && fromPeg[fromPeg.length - 1] === disk) {
      fromPeg.pop()
      pegs[to]?.push(disk)
    }
  }
  return pegs
}

function diskColor(disk: number, n: number) {
  const hues = ["from-violet-500 to-violet-600", "from-blue-500 to-blue-600", "from-fuchsia-500 to-fuchsia-600", "from-sky-500 to-sky-600", "from-indigo-500 to-indigo-600"]
  return hues[(disk - 1) % hues.length] ?? hues[0]
}

export function HanoiPegsViz({ n, movesSoFar }: { n: number; movesSoFar: string[] }) {
  const pegs = pegsAtStep(n, movesSoFar)
  const maxWidth = 120

  return (
    <div className="grid grid-cols-3 gap-4 px-2 py-4">
      {(["A", "B", "C"] as const).map((label) => (
        <div key={label} className="flex flex-col items-center">
          <div className="relative flex h-[150px] w-full flex-col-reverse items-center justify-start">
            {/* rod */}
            <div className="absolute bottom-0 left-1/2 h-[130px] w-1.5 -translate-x-1/2 rounded-full bg-neutral-400/40 dark:bg-neutral-600/40" />
            {/* base */}
            <div className="absolute bottom-0 h-1.5 w-full rounded-full bg-neutral-400/60 dark:bg-neutral-600/60" />
            {pegs[label].map((disk) => {
              const width = 28 + (disk / n) * (maxWidth - 28)
              return (
                <div
                  key={disk}
                  className={`z-10 mb-[3px] flex h-5 items-center justify-center rounded-md bg-gradient-to-r text-[10px] font-bold text-white shadow-sm transition-all duration-300 ${diskColor(disk, n)}`}
                  style={{ width }}
                >
                  {disk}
                </div>
              )
            })}
          </div>
          <span className="mt-1 text-xs font-mono font-semibold text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
