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
  { slug: "arrays", file: "components/visualizer/array/Array problems data.ts" },
  { slug: "sorting", file: "components/visualizer/sorting/sorting-problems-data.ts" },
  { slug: "linked-lists", file: "components/visualizer/linked-list/linked-list-problems-data.ts" },
  { slug: "stacks", file: "components/visualizer/stack/stack-problems-data.ts" },
  { slug: "queues", file: "components/visualizer/queue/queue-problems-data.ts" },
  { slug: "binary-tree", file: "components/visualizer/binary-tree/Binary tree problems data.tsx" },
  { slug: "heaps", file: "components/visualizer/heap/Heap problems data.tsx" },
  { slug: "graphs", file: "components/visualizer/graph/Graph problems data.ts" },
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
}

let drifted = false

for (const { slug, file } of FILES) {
  const content = readFileSync(join(root, file), "utf8")
  const matches = content.match(/^\s{2}slug: "/gm) ?? []
  const actual = matches.length
  const expected = EXPECTED[slug]
  if (actual !== expected) {
    drifted = true
    console.error(`✗ ${slug}: lib/topics.ts says ${expected}, but ${file} actually has ${actual}. Update lib/topics.ts.`)
  } else {
    console.log(`✓ ${slug}: ${actual}`)
  }
}

if (drifted) {
  process.exit(1)
}
console.log("All topic counts match.")
