// A fixed, hand-placed set of stars and connecting lines rendered as a
// single scalable SVG behind the World Map's chapters — pure decoration,
// not random per-render (which would just be noise), evoking a
// constellation linking the "planets" laid out in front of it.
// Percentage-based coordinates so it stretches to whatever height the
// page content ends up being.
const STARS = [
  { x: 6, y: 4 }, { x: 18, y: 12 }, { x: 11, y: 22 }, { x: 27, y: 8 },
  { x: 34, y: 18 }, { x: 8, y: 34 }, { x: 22, y: 30 }, { x: 40, y: 6 },
  { x: 92, y: 10 }, { x: 80, y: 16 }, { x: 88, y: 26 }, { x: 96, y: 34 },
  { x: 72, y: 6 }, { x: 66, y: 20 }, { x: 84, y: 42 }, { x: 60, y: 30 },
  { x: 4, y: 55 }, { x: 14, y: 66 }, { x: 24, y: 58 }, { x: 8, y: 78 },
  { x: 94, y: 58 }, { x: 82, y: 68 }, { x: 90, y: 80 }, { x: 74, y: 74 },
  { x: 18, y: 90 }, { x: 30, y: 82 }, { x: 6, y: 96 },
  { x: 86, y: 94 }, { x: 96, y: 88 }, { x: 68, y: 90 },
]

// A few edges per cluster, kept sparse so it reads as a constellation
// rather than a dense net.
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [3, 4], [2, 5], [5, 6], [3, 7],
  [8, 9], [9, 10], [10, 11], [8, 12], [12, 13], [13, 9], [10, 14], [13, 15],
  [16, 17], [17, 18], [16, 19], [17, 19],
  [20, 21], [21, 22], [21, 23],
  [24, 25], [24, 26],
  [27, 28], [27, 29],
]

export function ConstellationBackground() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-violet-500/25 dark:text-violet-300/20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={STARS[a].x}
          y1={STARS[a].y}
          x2={STARS[b].x}
          y2={STARS[b].y}
          stroke="currentColor"
          strokeWidth="0.08"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {STARS.map((star, i) => (
        <circle
          key={i}
          cx={star.x}
          cy={star.y}
          r="0.35"
          fill="currentColor"
          className="animate-pulse"
          style={{ animationDuration: `${3 + (i % 4)}s`, animationDelay: `${(i % 5) * 0.4}s` }}
        />
      ))}
    </svg>
  )
}
