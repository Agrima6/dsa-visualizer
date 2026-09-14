// Regression coverage for the same entry-function-selection bug class,
// applied to the tree instrumenter (BST insert + a findParent helper).
import { describe, expect, it } from "vitest"
import { instrumentTreeCode } from "@/lib/code-playground/instrument-tree"

const RUNTIME_PREAMBLE = `
var __steps = 0;
var __nodeCounter = 0;
var __root = null;
function makeNode(value) {
  __nodeCounter += 1;
  return { id: "n" + __nodeCounter, value: value, left: null, right: null };
}
function __nodeCmp(leftNode, rightNode, leftVal, rightVal, op) {
  switch (op) {
    case "<": return leftVal < rightVal;
    case ">": return leftVal > rightVal;
    case "<=": return leftVal <= rightVal;
    case ">=": return leftVal >= rightVal;
    case "===": return leftVal === rightVal;
    case "==": return leftVal == rightVal;
    case "!==": return leftVal !== rightVal;
    case "!=": return leftVal != rightVal;
    default: return false;
  }
}
`

async function insertAll(source: string, values: number[]) {
  const instrumented = await instrumentTreeCode(source)
  if (instrumented.error) throw new Error(instrumented.error)
  const fn = new Function(
    "values",
    `${RUNTIME_PREAMBLE}\n${instrumented.code}\nfor (const v of values) { __root = ${instrumented.functionName}(__root, v); }\nreturn __root;`
  )
  return fn(values)
}

function inorder(node: any): number[] {
  if (!node) return []
  return [...inorder(node.left), node.value, ...inorder(node.right)]
}

describe("instrumentTreeCode: entry-function selection", () => {
  it("picks the entry function over a helper it calls (insert + findParent)", async () => {
    const source = `
      function findParent(root, value) {
        if (value < root.value) {
          if (root.left === null) return root;
          return findParent(root.left, value);
        } else {
          if (root.right === null) return root;
          return findParent(root.right, value);
        }
      }
      function insert(root, value) {
        if (root === null) return makeNode(value);
        const parent = findParent(root, value);
        if (value < parent.value) parent.left = makeNode(value);
        else parent.right = makeNode(value);
        return root;
      }
    `
    const root = await insertAll(source, [50, 30, 70, 20, 40, 60, 80])
    expect(inorder(root)).toEqual([20, 30, 40, 50, 60, 70, 80])
  })

  it("works for a single recursive insert function (the common case)", async () => {
    const source = `function insert(root, value) {
      if (root === null) return makeNode(value);
      if (value < root.value) root.left = insert(root.left, value);
      else root.right = insert(root.right, value);
      return root;
    }`
    const root = await insertAll(source, [5, 3, 8, 1])
    expect(inorder(root)).toEqual([1, 3, 5, 8])
  })
})
