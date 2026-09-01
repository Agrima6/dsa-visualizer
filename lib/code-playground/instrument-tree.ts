// lib/code-playground/instrument-tree.ts
//
// The array playground (instrument.ts) tracks index access on one known
// parameter name. Tree code has no equivalent single "container" — a BST
// insert touches whatever pointer variable the recursion/loop currently
// holds (`root`, `node`, `current`, ...), so instead of tracking one
// identifier, this tracks a *shape*: any direct `<identifier>.value` read
// used in a comparison. That's name-agnostic and covers the overwhelming
// majority of hand-written BST insert code, recursive or iterative.
//
// `.left`/`.right` mutations are deliberately NOT instrumented here — the
// runner (tree-runner.ts) instead snapshots the whole tree fresh from its
// own root reference after every insert() call completes, which is both
// simpler and unambiguous (no risk of misreading a mutation's intent).
export interface TreeInstrumentResult {
  code: string
  functionName: string | null
  error: string | null
}

export async function instrumentTreeCode(source: string): Promise<TreeInstrumentResult> {
  const Babel = await import("@babel/standalone")
  let functionName: string | null = null

  function tracerPlugin({ types: t }: { types: any }) {
    function isNodeValueAccess(node: any): boolean {
      return (
        t.isMemberExpression(node) &&
        node.computed === false &&
        t.isIdentifier(node.property, { name: "value" }) &&
        t.isIdentifier(node.object)
      )
    }

    const COMPARISON_OPS = new Set(["<", ">", "<=", ">=", "===", "==", "!==", "!="])

    return {
      visitor: {
        Program(path: any) {
          for (const stmt of path.node.body) {
            if (t.isFunctionDeclaration(stmt) && stmt.id && stmt.params.length >= 2) {
              functionName = stmt.id.name
              break
            }
            if (t.isVariableDeclaration(stmt)) {
              for (const decl of stmt.declarations) {
                if (
                  t.isIdentifier(decl.id) &&
                  decl.init &&
                  (t.isArrowFunctionExpression(decl.init) || t.isFunctionExpression(decl.init)) &&
                  decl.init.params.length >= 2
                ) {
                  functionName = decl.id.name
                  break
                }
              }
              if (functionName) break
            }
          }
        },

        BinaryExpression(path: any) {
          const { node } = path
          if (!COMPARISON_OPS.has(node.operator)) return
          const leftIsValue = isNodeValueAccess(node.left)
          const rightIsValue = isNodeValueAccess(node.right)
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
    const result = Babel.transform(source, {
      presets: [],
      plugins: [tracerPlugin],
      compact: false,
    })

    if (!functionName) {
      return {
        code: "",
        functionName: null,
        error: "Define one function with two parameters — the current node and the value to insert, e.g. function insert(root, value) { ... }",
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
