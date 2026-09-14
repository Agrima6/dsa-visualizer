import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.ts"],
    // judge.test.ts spawns real node:worker_threads (the same sandbox
    // lib/battle/judge.ts uses in production). Vitest's default "threads"
    // pool *also* isolates test files using worker_threads, so running
    // the full suite nested worker_threads inside worker_threads —
    // observed as a single test that takes 5s in isolation randomly
    // taking 200-570s (at ~1% CPU, i.e. blocked, not actually looping)
    // when run alongside the other test files. "forks" isolates test
    // files with child_process instead, so judge.ts's own worker_threads
    // never nest inside another worker_thread.
    pool: "forks",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
