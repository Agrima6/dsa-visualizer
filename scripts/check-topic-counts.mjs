// Verifies lib/topics.ts's hardcoded `total` per topic still matches the
// real number of problems in each topic's problems-data file. Run this
// after adding or removing a problem:
//   node scripts/check-topic-counts.mjs

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const FILES = [
  { slug: "arrays", files: ["components/visualizer/array/Array problems data.ts"] },
  { slug: "sorting", files: ["components/visualizer/sorting/sorting-problems-data.ts"] },
  { slug: "linked-lists", files: ["components/visualizer/linked-list/linked-list-problems-data.ts"] },
  { slug: "stacks", files: ["components/visualizer/stack/stack-problems-data.ts"] },
  { slug: "queues", files: ["components/visualizer/queue/queue-problems-data.ts"] },
  { slug: "binary-tree", files: ["components/visualizer/binary-tree/Binary tree problems data.tsx"] },
  { slug: "heaps", files: ["components/visualizer/heap/Heap problems data.tsx"] },
  { slug: "graphs", files: ["components/visualizer/graph/Graph problems data.ts"] },
  {
    slug: "recursion",
    files: [
      "components/visualizer/recursion/recursion-problems-core.ts",
      "components/visualizer/recursion/recursion-problems-beginner.ts",
      "components/visualizer/recursion/recursion-problems-intermediate.ts",
      "components/visualizer/recursion/recursion-problems-advanced.ts",
    ],
  },
]

const EXPECTED = {
  arrays: 28,
  sorting: 10,
  "linked-lists": 10,
  stacks: 10,
  queues: 10,
  "binary-tree": 10,
  heaps: 10,
  graphs: 10,
  recursion: 20,
}

let drifted = false

for (const { slug, files } of FILES) {
  const actual = files.reduce((sum, file) => {
    const content = readFileSync(join(root, file), "utf8")
    const matches = content.match(/^\s{2}slug: "/gm) ?? []
    return sum + matches.length
  }, 0)
  const expected = EXPECTED[slug]
  if (actual !== expected) {
    drifted = true
    console.error(`✗ ${slug}: lib/topics.ts says ${expected}, but source file(s) actually have ${actual}. Update lib/topics.ts.`)
  } else {
    console.log(`✓ ${slug}: ${actual}`)
  }
}

if (drifted) {
  process.exit(1)
}
console.log("All topic counts match.")
