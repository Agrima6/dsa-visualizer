"use client"

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

export function DPUnderstand() {
  return (
    <div className="space-y-6">
      <Card title="What is Dynamic Programming?">
        <p>
          Dynamic programming solves a big problem by breaking it into overlapping
          smaller subproblems, solving each one <em>once</em>, and reusing the answer
          instead of recomputing it. A DP table is just a cache — every cell stores the
          answer to one subproblem, so the cell to its right or below can be built from
          answers you've already computed.
        </p>
        <p>
          If a plain recursive solution recomputes the same subproblem thousands of
          times, that's the signal DP applies. Two ingredients make it work: <strong>optimal
          substructure</strong> (the best answer is built from the best answers to
          subproblems) and <strong>overlapping subproblems</strong> (the same subproblem
          shows up again and again).
        </p>
      </Card>

      <Card title="0/1 Knapsack">
        <p>
          You have items, each with a weight and a value, and a bag with a fixed
          capacity. Pick a subset of items (each item used at most once — hence
          "0/1") that maximizes total value without exceeding capacity.
        </p>
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w - weight[i]])
          </code>{" "}
          — at each item, you either skip it (carry forward the row above) or take it
          (add its value to the best answer for the remaining capacity, one row up).
          The bottom-right cell holds the final answer; walking back through the table
          reveals exactly which items were chosen.
        </p>
      </Card>

      <Card title="Longest Common Subsequence (LCS)">
        <p>
          Given two strings, find the longest sequence of characters that appears in
          both, in order but not necessarily contiguous. It's the algorithm behind
          diff tools and version-control merges.
        </p>
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            dp[i][j] = dp[i-1][j-1] + 1 if A[i]==B[j], else max(dp[i-1][j], dp[i][j-1])
          </code>{" "}
          — when characters match, extend the diagonal answer; otherwise take the best
          of dropping a character from either string. The diagonal "path" cells traced
          back from the bottom-right spell out the actual subsequence.
        </p>
      </Card>

      <Card title="Why it matters">
        <p>
          Both problems here are exponential (2ⁿ) with a naive brute-force recursion.
          The DP table collapses each one down to O(n·capacity) or O(n·m) — polynomial
          time — purely by never solving the same subproblem twice. Watch the grid fill
          cell by cell in the Visualization tab, then run "max value" or "LCS" to see
          the algorithm trace its own answer back through the table it just built.
        </p>
      </Card>
    </div>
  )
}
