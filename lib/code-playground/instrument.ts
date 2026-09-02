// lib/code-playground/instrument.ts
//
// Rewrites a user-authored function like:
//   function solve(arr) { ... }
// so that, when the resulting code runs, it emits a trace event for every
// comparison and mutation of `arr` — via bare function calls (__cmp,
// __afterSwap, __afterWrite) that runner.ts's worker runtime defines.
//
// This is pattern-based instrumentation, not a general dataflow analysis:
// it recognizes `arr[i] OP arr[j]` comparisons and `arr[i] = ...` /
// `[arr[i], arr[j]] = [arr[j], arr[i]]` swap-destructuring, which covers
// the overwhelming majority of hand-written sorting/array algorithms
// (bubble, selection, insertion, and most quicksort/mergesort variants
// people actually write by hand). Code that only ever produces a brand
// new array (e.g. via .map/.filter/.sort with no direct index writes)
// will still execute and return the correct result — it just won't
// produce a step-by-step trace, since there's nothing to hook.
export interface InstrumentResult {
  code: string
  functionName: string | null
  paramName: string | null
  error: string | null
}

const COMPARISON_OPS = new Set(["<", ">", "<=", ">=", "===", "==", "!==", "!="])

/**
 * @babel/standalone bundles a full JS parser + compiler (several hundred KB)
 * — dynamically imported here so it's only fetched the first time someone
 * actually clicks "Run", instead of bloating this page's initial load for
 * every visitor who just opens it to look around.
 */
export async function instrumentUserCode(source: string): Promise<InstrumentResult> {
  const Babel = await import("@babel/standalone")
  let functionName: string | null = null
  let paramName: string | null = null

  function tracerPlugin({ types: t }: { types: any }) {
    function isTrackedMember(node: any): boolean {
      // computed: true means bracket notation (arr[i]) — an actual index
      // access. Dot notation (arr.length, arr.push, ...) is also a
      // MemberExpression on the same identifier but never an element
      // read/write, so it must be excluded here.
      return (
        paramName !== null &&
        t.isMemberExpression(node) &&
        node.computed === true &&
        t.isIdentifier(node.object, { name: paramName })
      )
    }

    return {
      visitor: {
        Program(path: any) {
          // Collect every top-level function whose first parameter is a
          // plain identifier — that identifier is treated as "the array".
          // Real hand-written sorts are often split into an entry function
          // plus helpers (e.g. `partition` + `quickSort`, or `merge` +
          // `mergeSort`) that also happen to take an array first — so we
          // can't just take the first match found in source order, or a
          // helper defined above the real entry point gets run instead
          // (called with no low/high bounds at all).
          const candidates: { name: string; paramName: string; path: any }[] = []
          for (const stmtPath of path.get("body")) {
            const stmt = stmtPath.node
            if (
              t.isFunctionDeclaration(stmt) &&
              stmt.id &&
              stmt.params[0] &&
              t.isIdentifier(stmt.params[0])
            ) {
              candidates.push({ name: stmt.id.name, paramName: stmt.params[0].name, path: stmtPath })
            } else if (t.isVariableDeclaration(stmt)) {
              for (const decl of stmt.declarations) {
                if (
                  t.isIdentifier(decl.id) &&
                  decl.init &&
                  (t.isArrowFunctionExpression(decl.init) || t.isFunctionExpression(decl.init)) &&
                  decl.init.params[0] &&
                  t.isIdentifier(decl.init.params[0])
                ) {
                  candidates.push({ name: decl.id.name, paramName: decl.init.params[0].name, path: stmtPath })
                }
              }
            }
          }

          if (candidates.length === 0) return
          if (candidates.length === 1) {
            functionName = candidates[0].name
            paramName = candidates[0].paramName
            return
          }

          // Prefer whichever candidate is never called by one of the
          // others — that's the outer entry point; whatever it calls is a
          // helper. If that signal is ambiguous, fall back to the last
          // candidate defined, since helpers are conventionally written
          // before the function that uses them.
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
          const chosen = entryCandidates.length === 1 ? entryCandidates[0] : candidates[candidates.length - 1]
          functionName = chosen.name
          paramName = chosen.paramName
        },

        BinaryExpression(path: any) {
          const { node } = path
          if (!COMPARISON_OPS.has(node.operator)) return
          const leftIsMember = isTrackedMember(node.left)
          const rightIsMember = isTrackedMember(node.right)
          if (!leftIsMember && !rightIsMember) return

          const leftIndex = leftIsMember ? t.cloneNode(node.left.property) : t.nullLiteral()
          const rightIndex = rightIsMember ? t.cloneNode(node.right.property) : t.nullLiteral()

          path.replaceWith(
            t.callExpression(t.identifier("__cmp"), [
              t.identifier(paramName as string),
              leftIndex,
              rightIndex,
              t.cloneNode(node.left),
              t.cloneNode(node.right),
              t.stringLiteral(node.operator),
            ])
          )
          path.skip()
        },

        AssignmentExpression(path: any) {
          const { node } = path
          if (node.operator !== "=" || !paramName) return
          const stmtPath = path.getStatementParent()
          if (!stmtPath) return

          // Swap pattern: [arr[i], arr[j]] = [arr[j], arr[i]]
          if (
            t.isArrayPattern(node.left) &&
            t.isArrayExpression(node.right) &&
            node.left.elements.length === 2 &&
            node.right.elements.length === 2 &&
            node.left.elements.every((el: any) => isTrackedMember(el)) &&
            node.right.elements.every((el: any) => isTrackedMember(el))
          ) {
            const i = t.cloneNode(node.left.elements[0].property)
            const j = t.cloneNode(node.left.elements[1].property)
            stmtPath.insertAfter(
              t.expressionStatement(
                t.callExpression(t.identifier("__afterSwap"), [t.identifier(paramName), i, j])
              )
            )
            return
          }

          // Simple index write: arr[i] = <expr>
          if (isTrackedMember(node.left)) {
            const i = t.cloneNode(node.left.property)
            stmtPath.insertAfter(
              t.expressionStatement(
                t.callExpression(t.identifier("__afterWrite"), [t.identifier(paramName), i])
              )
            )
          }
        },

        "ForStatement|WhileStatement|DoWhileStatement"(path: any) {
          // A shared __steps counter (declared by the worker runtime, not
          // here) is incremented on every loop-body execution across the
          // whole run — this is what turns a `while (true) {}` the user
          // pastes into a clean caught error instead of a frozen tab.
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
    const result = Babel.transform(source, {
      presets: [],
      plugins: [tracerPlugin],
      compact: false,
    })

    if (!functionName || !paramName) {
      return {
        code: "",
        functionName: null,
        paramName: null,
        error: "Define one function that takes an array as its first parameter, e.g. function solve(arr) { ... }",
      }
    }

    return { code: result?.code ?? "", functionName, paramName, error: null }
  } catch (err) {
    return {
      code: "",
      functionName: null,
      paramName: null,
      error: err instanceof Error ? err.message : "Failed to parse your code.",
    }
  }
}
