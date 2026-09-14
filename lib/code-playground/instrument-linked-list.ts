// lib/code-playground/instrument-linked-list.ts
//
// Extends Code Playground to singly-linked lists, reusing the same
// name-agnostic shape-detection idea as instrument-tree.ts (any
// `<identifier>.value`/`.next`, regardless of what the pointer variable is
// called) rather than tracking one specific parameter the way the array
// instrumenter does — list code reassigns its "current" pointer through
// variables named all sorts of things (`curr`, `node`, `head`, `runner`).
//
// Three shapes get instrumented, name-agnostically, everywhere in the file:
//   - `<node>.value` used in a comparison -> __nodeCmp (identical to the
//     tree instrumenter's handling)
//   - `<ident> = <node>.next` (a traversal step, e.g. `curr = curr.next`)
//     -> __traverse, so a pure read-only walk still animates step by step
//   - `<node>.next = <expr>` (a structural mutation) -> __afterLink, so
//     insert/delete/reverse operations re-snapshot the list after the
//     pointer rewire actually happens
//
// Entry-function selection reuses the same "prefer whichever candidate is
// never called by another candidate" logic from instrument.ts and
// instrument-tree.ts, but with a broader candidate net: unlike a BST
// insert (always >=2 params) list functions vary in shape — reverseList
// takes just the head, insertAtEnd takes head+value — so any top-level
// function/arrow with at least one parameter is a candidate.
export interface LinkedListInstrumentResult {
  code: string
  functionName: string | null
  error: string | null
}

const COMPARISON_OPS = new Set(["<", ">", "<=", ">=", "===", "==", "!==", "!="])

export async function instrumentLinkedListCode(source: string): Promise<LinkedListInstrumentResult> {
  const Babel = await import("@babel/standalone")
  let functionName: string | null = null

  function tracerPlugin({ types: t }: { types: any }) {
    function isValueAccess(node: any): boolean {
      return (
        t.isMemberExpression(node) &&
        node.computed === false &&
        t.isIdentifier(node.property, { name: "value" }) &&
        t.isIdentifier(node.object)
      )
    }

    function isNextAccess(node: any): boolean {
      return (
        t.isMemberExpression(node) &&
        node.computed === false &&
        t.isIdentifier(node.property, { name: "next" }) &&
        t.isIdentifier(node.object)
      )
    }

    return {
      visitor: {
        Program(path: any) {
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

          if (candidates.length === 0) return
          if (candidates.length === 1) {
            functionName = candidates[0].name
            return
          }

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
        },

        BinaryExpression(path: any) {
          const { node } = path
          if (!COMPARISON_OPS.has(node.operator)) return
          const leftIsValue = isValueAccess(node.left)
          const rightIsValue = isValueAccess(node.right)
          if (!leftIsValue && !rightIsValue) return

          const leftNode = leftIsValue ? t.cloneNode(node.left.object) : t.nullLiteral()
          const rightNode = rightIsValue ? t.cloneNode(node.right.object) : t.nullLiteral()

          path.replaceWith(
            t.callExpression(t.identifier("__nodeCmp"), [
              leftNode,
              rightNode,
              t.cloneNode(node.left),
              t.cloneNode(node.right),
              t.stringLiteral(node.operator),
            ])
          )
          path.skip()
        },

        AssignmentExpression(path: any) {
          const { node } = path
          if (node.operator !== "=") return
          const stmtPath = path.getStatementParent()
          if (!stmtPath) return

          // Structural mutation: <node>.next = <expr> — record *after* the
          // rewire actually happens, since that's when the list's real
          // shape changed.
          if (isNextAccess(node.left)) {
            stmtPath.insertAfter(t.expressionStatement(t.callExpression(t.identifier("__afterLink"), [])))
            return
          }

          // Traversal step: <ident> = <node>.next — a pure pointer move,
          // no mutation. Reports the *new* current node (by re-reading the
          // assignment target) so the animation can highlight it.
          if (isNextAccess(node.right) && t.isIdentifier(node.left)) {
            stmtPath.insertAfter(
              t.expressionStatement(t.callExpression(t.identifier("__traverse"), [t.cloneNode(node.left)]))
            )
          }
        },

        "ForStatement|WhileStatement|DoWhileStatement"(path: any) {
          // Same fast, clean-error guard as instrument.ts/instrument-tree.ts
          // — list traversal is almost always a while loop, so this is
          // *the* place an infinite loop shows up here.
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
        error: "Define one function that takes at least one parameter — the list's head, e.g. function reverseList(head) { ... }",
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
