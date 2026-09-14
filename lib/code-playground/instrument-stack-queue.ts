// lib/code-playground/instrument-stack-queue.ts
//
// Extends Code Playground to stack/queue problems. Architecturally
// different from the array/tree/linked-list instrumenters: a stack in
// real hand-written code is almost always a plain array the function
// creates for itself (`const stack = [];`) rather than something passed
// in as a parameter, and classic problems take all kinds of input (a
// string for Valid Parentheses, a number array for Next Greater Element,
// a plain number for Generate Binary Numbers) — there's no single "the
// array" parameter to anchor on the way the sort instrumenter anchors on
// its first parameter.
//
// So instead of tracking a parameter, this does two things:
//   1. Finds the *first* `<identifier>.push/pop/shift/unshift(...)` call
//      anywhere in the file (name-agnostic — whatever the variable is
//      called) and remembers that identifier's name as "the structure
//      being visualized".
//   2. Wraps every push/pop/shift/unshift call on *that specific name*
//      with __stackOp(...), which performs the real operation exactly
//      once (so arguments with side effects are never duplicated — the
//      same lesson the array instrumenter's write-tracking learned the
//      hard way) and records a trace event.
//
// Known, disclosed scope boundary: a problem using two distinct stacks/
// queues (e.g. "implement a queue with two stacks") will only have its
// *first*-encountered structure tracked — the other's operations run
// correctly (nothing here can break them) but won't appear in the trace.
export interface StackQueueInstrumentResult {
  code: string
  functionName: string | null
  error: string | null
}

const TRACKED_METHODS = new Set(["push", "pop", "shift", "unshift"])

export async function instrumentStackQueueCode(source: string): Promise<StackQueueInstrumentResult> {
  const Babel = await import("@babel/standalone")
  let functionName: string | null = null
  let trackedName: string | null = null

  function tracerPlugin({ types: t }: { types: any }) {
    function isTrackedCall(node: any): boolean {
      return (
        t.isCallExpression(node) &&
        t.isMemberExpression(node.callee) &&
        node.callee.computed === false &&
        t.isIdentifier(node.callee.object) &&
        t.isIdentifier(node.callee.property) &&
        TRACKED_METHODS.has(node.callee.property.name)
      )
    }

    return {
      visitor: {
        Program(path: any) {
          // Entry-function selection: same "prefer whichever candidate is
          // never called by another" logic as the other three
          // instrumenters, with the broadest candidate net yet — a stack
          // problem's entry function could take a string, a number, or an
          // array, so there's no reliable parameter-shape signal at all;
          // any top-level function/arrow with >=1 parameter is a candidate.
          const candidates: { name: string; path: any }[] = []
          for (const stmtPath of path.get("body")) {
            const stmt = stmtPath.node
            if (t.isFunctionDeclaration(stmt) && stmt.id && stmt.params.length >= 1) {
              candidates.push({ name: stmt.id.name, path: stmtPath })
            } else if (t.isVariableDeclaration(stmt)) {
              for (const decl of stmt.declarations) {
                if (
                  t.isIdentifier(decl.id) &&
                  decl.init &&
                  (t.isArrowFunctionExpression(decl.init) || t.isFunctionExpression(decl.init)) &&
                  decl.init.params.length >= 1
                ) {
                  candidates.push({ name: decl.id.name, path: stmtPath })
                }
              }
            }
          }

          if (candidates.length === 1) {
            functionName = candidates[0].name
          } else if (candidates.length > 1) {
            const names = new Set(candidates.map((c) => c.name))
            const calledByOthers = new Set<string>()
            for (const c of candidates) {
              c.path.traverse({
                CallExpression(callPath: any) {
                  const callee = callPath.node.callee
                  if (t.isIdentifier(callee) && names.has(callee.name) && callee.name !== c.name) {
                    calledByOthers.add(callee.name)
                  }
                },
              })
            }
            const entryCandidates = candidates.filter((c) => !calledByOthers.has(c.name))
            functionName = (entryCandidates.length === 1 ? entryCandidates[0] : candidates[candidates.length - 1]).name
          }

          // Find the first push/pop/shift/unshift call anywhere, in
          // source order, and remember its object's name — that's "the"
          // structure this run will visualize.
          path.traverse({
            CallExpression(callPath: any) {
              if (trackedName !== null) return
              if (isTrackedCall(callPath.node)) {
                trackedName = callPath.node.callee.object.name
              }
            },
          })
        },

        CallExpression(path: any) {
          const { node } = path
          if (!isTrackedCall(node)) return
          if (!trackedName || node.callee.object.name !== trackedName) return

          const method = node.callee.property.name
          const arrRef = t.cloneNode(node.callee.object)
          // Each call's own arguments are passed through untouched and
          // exactly once — __stackOp performs the real push/pop/shift/
          // unshift itself, so nothing here duplicates a side-effecting
          // argument expression.
          path.replaceWith(
            t.callExpression(t.identifier("__stackOp"), [arrRef, t.stringLiteral(method), ...node.arguments])
          )
          path.skip()
        },

        "ForStatement|WhileStatement|DoWhileStatement"(path: any) {
          const bodyPath = path.get("body")
          const guard = t.ifStatement(
            t.binaryExpression(">", t.updateExpression("++", t.identifier("__steps"), true), t.identifier("__MAX_STEPS")),
            t.throwStatement(
              t.newExpression(t.identifier("Error"), [t.stringLiteral("Too many iterations — possible infinite loop.")])
            )
          )
          if (t.isBlockStatement(bodyPath.node)) {
            bodyPath.unshiftContainer("body", guard)
          } else {
            bodyPath.replaceWith(t.blockStatement([guard, bodyPath.node]))
          }
        },
      },
    }
  }

  try {
    const result = Babel.transform(source, { presets: [], plugins: [tracerPlugin], compact: false })

    if (!functionName) {
      return {
        code: "",
        functionName: null,
        error: "Define one function that takes at least one parameter, e.g. function isValid(s) { ... }",
      }
    }

    return { code: result?.code ?? "", functionName, error: null }
  } catch (err) {
    return {
      code: "",
      functionName: null,
      error: err instanceof Error ? err.message : "Failed to parse your code.",
    }
  }
}
