// lib/battle/replay-instrument.ts
//
// Powers Code Battle's post-match "Compare Approaches" panel: run both
// players' final solutions against the same input and show how much work
// each one actually did — not just that both passed.
//
// This is deliberately a *different, simpler* instrumenter than Code
// Playground's (lib/code-playground/instrument.ts). That one tracks index
// access on one specific array parameter, which only means something for
// hand-written array/sort algorithms. Battle problems have every kind of
// signature — a string, two arrays, a number, an array-and-a-number — so
// there's no single "the array" to track. Instead this counts *shape-
// agnostic* signals that mean the same thing for any function:
//   - every loop iteration (for/while/do-while)
//   - every comparison evaluated (any binary operator, on anything)
//   - every call to the function itself (recursion depth proxy)
// That trio is enough to tell "this did a handful of operations" from
// "this did thousands" regardless of what the function's parameters are —
// which is exactly the signal that distinguishes, say, an O(n) hashmap
// approach from an O(n²) nested-loop one on the same input.
export interface ReplayInstrumentResult {
  code: string
  error: string | null
}

const COMPARISON_OPS = new Set(["<", ">", "<=", ">=", "===", "==", "!==", "!="])

export async function instrumentForReplay(source: string): Promise<ReplayInstrumentResult> {
  const Babel = await import("@babel/standalone")

  function counterPlugin({ types: t }: { types: any }) {
    return {
      visitor: {
        BinaryExpression(path: any) {
          if (!COMPARISON_OPS.has(path.node.operator)) return
          path.replaceWith(
            t.sequenceExpression([
              t.updateExpression("++", t.memberExpression(t.identifier("__ops"), t.identifier("comparisons")), false),
              path.node,
            ])
          )
          path.skip()
        },

        CallExpression(path: any) {
          const callee = path.node.callee
          if (t.isIdentifier(callee, { name: "solve" })) {
            path.replaceWith(
              t.sequenceExpression([
                t.updateExpression("++", t.memberExpression(t.identifier("__ops"), t.identifier("calls")), false),
                path.node,
              ])
            )
            path.skip()
          }
        },

        "ForStatement|WhileStatement|DoWhileStatement"(path: any) {
          const bodyPath = path.get("body")
          const guard = t.expressionStatement(
            t.updateExpression("++", t.memberExpression(t.identifier("__ops"), t.identifier("loopIterations")), false)
          )
          // Same iteration cap as Code Playground's instrumenter, for the
          // same reason: this runs arbitrary code in the visitor's own
          // browser, so a pasted `while (true) {}` needs a fast, clean
          // way to stop instead of freezing the tab.
          const cap = t.ifStatement(
            t.binaryExpression(">", t.memberExpression(t.identifier("__ops"), t.identifier("loopIterations")), t.numericLiteral(500_000)),
            t.throwStatement(t.newExpression(t.identifier("Error"), [t.stringLiteral("Too many iterations — possible infinite loop.")]))
          )
          if (t.isBlockStatement(bodyPath.node)) {
            bodyPath.unshiftContainer("body", cap)
            bodyPath.unshiftContainer("body", guard)
          } else {
            bodyPath.replaceWith(t.blockStatement([guard, cap, bodyPath.node]))
          }
        },
      },
    }
  }

  try {
    const result = Babel.transform(source, { presets: [], plugins: [counterPlugin], compact: false })
    return { code: result?.code ?? "", error: null }
  } catch (err) {
    return { code: "", error: err instanceof Error ? err.message : "Failed to parse this solution." }
  }
}
