import { describe, expect, it } from "vitest"
import { instrumentLinkedListCode } from "@/lib/code-playground/instrument-linked-list"

const RUNTIME_PREAMBLE = `
var __steps = 0;
var __MAX_STEPS = 200000;
var __nodeCounter = 0;
function makeNode(value) {
  __nodeCounter += 1;
  return { id: "n" + __nodeCounter, value: value, next: null };
}
function __snapshotList(head) {
  var nodes = []; var cur = head; var guard = 0;
  while (cur && guard++ < 2000) { nodes.push({ id: cur.id, value: cur.value }); cur = cur.next; }
  return nodes;
}
function __nodeCmp(l, r, lv, rv, op) {
  switch (op) {
    case "<": return lv < rv;
    case ">": return lv > rv;
    case "<=": return lv <= rv;
    case ">=": return lv >= rv;
    case "===": return lv === rv;
    case "==": return lv == rv;
    case "!==": return lv !== rv;
    case "!=": return lv != rv;
    default: return false;
  }
}
function __traverse() {}
function __afterLink() {}
`

async function buildList(source: string, entryOverride: string | undefined, values: number[]) {
  const instrumented = await instrumentLinkedListCode(source)
  if (instrumented.error) throw new Error(instrumented.error)
  const fn = entryOverride ?? instrumented.functionName
  const runner = new Function(
    "values",
    `${RUNTIME_PREAMBLE}\n${instrumented.code}\nvar __head = null;\nfor (const v of values) { __head = ${fn}(__head, v); }\nreturn __snapshotList(__head);`
  )
  return { snapshot: runner(values) as { id: string; value: number }[], functionName: instrumented.functionName }
}

describe("instrumentLinkedListCode: entry-function selection", () => {
  it("picks the outer function over a helper it calls", async () => {
    const source = `
      function appendNode(node, value) {
        const newNode = makeNode(value);
        node.next = newNode;
        return newNode;
      }
      function buildList(head, value) {
        if (head === null) return makeNode(value);
        let tail = head;
        while (tail.next !== null) tail = tail.next;
        appendNode(tail, value);
        return head;
      }
    `
    const { functionName, snapshot } = await buildList(source, undefined, [1, 2, 3])
    expect(functionName).toBe("buildList")
    expect(snapshot.map((n) => n.value)).toEqual([1, 2, 3])
  })

  it("works for a single insert-at-end function (the common case)", async () => {
    const source = `function insertAtEnd(head, value) {
      const node = makeNode(value);
      if (head === null) return node;
      let current = head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = node;
      return head;
    }`
    const { snapshot } = await buildList(source, undefined, [10, 20, 30])
    expect(snapshot.map((n) => n.value)).toEqual([10, 20, 30])
  })

  it("handles insert-at-front correctly", async () => {
    const source = `function insertAtFront(head, value) {
      const node = makeNode(value);
      node.next = head;
      return node;
    }`
    const { snapshot } = await buildList(source, undefined, [1, 2, 3])
    // each new value goes to the front, so the final order is reversed insertion order
    expect(snapshot.map((n) => n.value)).toEqual([3, 2, 1])
  })

  it("errors cleanly when no function takes at least one parameter", async () => {
    const instrumented = await instrumentLinkedListCode(`function solve() { return 42; }`)
    expect(instrumented.error).toBeTruthy()
    expect(instrumented.functionName).toBeNull()
  })

  it("injects the iteration guard into while loops (infinite-loop protection)", async () => {
    const instrumented = await instrumentLinkedListCode(`function walk(head) {
      let current = head;
      while (true) { current = current.next; }
      return head;
    }`)
    expect(instrumented.code).toContain("__MAX_STEPS")
    expect(instrumented.code).toContain("Too many iterations")
  })
})
