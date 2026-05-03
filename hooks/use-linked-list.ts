import { useState } from 'react'
import {
  ListType,
  ListNode,
  LinkedList,
  ListOperation,
  AnimationState,
} from '@/components/visualizer/linked-list/types'
import { useAlgorithmFeedback } from '@/hooks/use-algorithm-feedback'

let nodeIdCounter = 0

const createNode = (value: number): ListNode => ({
  id: `node-${nodeIdCounter++}`,
  value: value.toString(),
  next: null,
  prev: null,
})

export function useLinkedList(type: ListType) {
  const [list, setList] = useState<LinkedList>({
    type,
    head: null,
    tail: null,
    nodes: new Map(),
  })

  const [operations, setOperations] = useState<ListOperation[]>([])
  const [animationState, setAnimationState] = useState<AnimationState>({
    highlightedNodes: [],
    message: '',
  })
  const [isAnimating, setIsAnimating] = useState(false)

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const addOperation = (operation: Omit<ListOperation, 'timestamp'>) => {
    setOperations((prev) => [...prev, { ...operation, timestamp: Date.now() }])
  }

  const setHighlight = (nodeIds: string[], message: string) => {
    setAnimationState({ highlightedNodes: nodeIds, message })
  }

  // 🔥 CORE FIX — centralized circular consistency
  const normalizeCircularLinks = (
    nodes: Map<string, ListNode>,
    head: string | null,
    tail: string | null
  ) => {
    if (!head || !tail) return

    const headNode = nodes.get(head)
    const tailNode = nodes.get(tail)

    if (!headNode || !tailNode) return

    if (type === 'CSLL' || type === 'CDLL') {
      tailNode.next = head
    }

    if (type === 'CDLL') {
      headNode.prev = tail
    }
  }

  // ================= INSERT FRONT =================
  const insertFront = async (value: number) => {
    if (isAnimating) return
    setIsAnimating(true)

    addOperation({ type: 'insert-front', value })

    const nodes = new Map(list.nodes)
    const newNode = createNode(value)
    nodes.set(newNode.id, newNode)

    if (!list.head) {
      setHighlight([newNode.id], 'Creating first node')
      stepSound()
      await delay(400)

      if (type === 'CSLL' || type === 'CDLL') {
        newNode.next = newNode.id
      }
      if (type === 'CDLL') {
        newNode.prev = newNode.id
      }

      setList({ ...list, head: newNode.id, tail: newNode.id, nodes })
    } else {
      const oldHead = nodes.get(list.head)!
      newNode.next = list.head

      if (type === 'DLL' || type === 'CDLL') {
        oldHead.prev = newNode.id
      }

      setHighlight([newNode.id, list.head], 'Linking new head')
      stepSound()
      await delay(400)

      normalizeCircularLinks(nodes, newNode.id, list.tail)

      setList({ ...list, head: newNode.id, nodes })
    }

    setHighlight([], '')
    setIsAnimating(false)
    endSound()
  }

  // ================= INSERT BACK =================
  const insertBack = async (value: number) => {
    if (isAnimating) return
    setIsAnimating(true)

    addOperation({ type: 'insert-back', value })

    const nodes = new Map(list.nodes)
    const newNode = createNode(value)
    nodes.set(newNode.id, newNode)

    if (!list.tail) {
      setHighlight([newNode.id], 'Creating first node')
      stepSound()
      await delay(400)

      if (type === 'CSLL' || type === 'CDLL') {
        newNode.next = newNode.id
      }
      if (type === 'CDLL') {
        newNode.prev = newNode.id
      }

      setList({ ...list, head: newNode.id, tail: newNode.id, nodes })
    } else {
      const oldTail = nodes.get(list.tail)!
      oldTail.next = newNode.id

      if (type === 'DLL' || type === 'CDLL') {
        newNode.prev = list.tail
      }

      setHighlight([list.tail, newNode.id], 'Linking new tail')
      stepSound()
      await delay(400)

      normalizeCircularLinks(nodes, list.head, newNode.id)

      setList({ ...list, tail: newNode.id, nodes })
    }

    setHighlight([], '')
    setIsAnimating(false)
    endSound()
  }

  // ================= DELETE FRONT =================
  const deleteFront = async () => {
    if (isAnimating || !list.head) return
    setIsAnimating(true)

    addOperation({ type: 'delete-front' })

    const nodes = new Map(list.nodes)
    const oldHead = nodes.get(list.head)!

    setHighlight([list.head], 'Removing head')
    stepSound()
    await delay(400)

    if (list.head === list.tail) {
      setList({ ...list, head: null, tail: null, nodes: new Map() })
    } else {
      const newHead = oldHead.next!
      nodes.delete(list.head)

      if (type === 'DLL' || type === 'CDLL') {
        const newHeadNode = nodes.get(newHead)!
        newHeadNode.prev = type === 'CDLL' ? list.tail : null
      }

      normalizeCircularLinks(nodes, newHead, list.tail)

      setList({ ...list, head: newHead, nodes })
    }

    setHighlight([], '')
    setIsAnimating(false)
    endSound()
  }

  // ================= DELETE BACK =================
  const deleteBack = async () => {
    if (isAnimating || !list.tail) return
    setIsAnimating(true)

    addOperation({ type: 'delete-back' })

    const nodes = new Map(list.nodes)

    setHighlight([list.tail], 'Removing tail')
    stepSound()
    await delay(400)

    if (list.head === list.tail) {
      setList({ ...list, head: null, tail: null, nodes: new Map() })
    } else {
      let current = list.head
      let newTail: string | null = null

      while (current) {
        const node = nodes.get(current)!
        if (node.next === list.tail) {
          newTail = current
          break
        }
        current = node.next
      }

      if (newTail) {
        nodes.delete(list.tail)

        if (type === 'DLL' || type === 'CDLL') {
          const newTailNode = nodes.get(newTail)!
          newTailNode.next = null
        }

        normalizeCircularLinks(nodes, list.head, newTail)

        setList({ ...list, tail: newTail, nodes })
      }
    }

    setHighlight([], '')
    setIsAnimating(false)
    endSound()
  }

  // ================= REVERSE =================
  const reverse = async () => {
    if (isAnimating || !list.head) return
    setIsAnimating(true)

    addOperation({ type: 'reverse' })

    const nodes = new Map(list.nodes)

    let curr = list.head
    let prev: string | null = null

    while (curr) {
      const node = nodes.get(curr)!
      const next = node.next

      node.next = prev

      if (type === 'DLL' || type === 'CDLL') {
        node.prev = next
      }

      prev = curr
      curr = next !== null ? next : ''
    }

    normalizeCircularLinks(nodes, list.tail, list.head)

    setList({
      ...list,
      head: list.tail,
      tail: list.head,
      nodes,
    })

    setHighlight([], '')
    setIsAnimating(false)
    endSound()
  }

  return {
    list,
    operations,
    animationState,
    isAnimating,
    insertFront,
    insertBack,
    deleteFront,
    deleteBack,
    reverse,
  }
}