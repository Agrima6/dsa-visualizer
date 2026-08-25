import { useState, useRef } from "react"
import { AVLTreeNode, RotationType } from "@/components/visualizer/avl-tree/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"
import { playNarration } from "@/lib/narration"

let nodeIdCounter = 0

function height(node: AVLTreeNode | null): number {
  return node ? node.height : 0
}

function balanceFactor(node: AVLTreeNode | null): number {
  return node ? height(node.left) - height(node.right) : 0
}

function updateHeight(node: AVLTreeNode) {
  node.height = 1 + Math.max(height(node.left), height(node.right))
}

function cloneTree(node: AVLTreeNode | null): AVLTreeNode | null {
  if (!node) return null
  return { ...node, left: cloneTree(node.left), right: cloneTree(node.right) }
}

interface RotationEvent {
  type: RotationType
  atValue: number
}

export function useAVLTree() {
  const [tree, setTreeState] = useState<AVLTreeNode | null>(null)
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [rotatingNodes, setRotatingNodes] = useState<string[]>([])
  const [traversalHistory, setTraversalHistory] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [lastMessage, setLastMessage] = useState<string>("")
  const [rotationCount, setRotationCount] = useState(0)
  const [rotationHistory, setRotationHistory] = useState<RotationEvent[]>([])

  const treeRef = useRef<AVLTreeNode | null>(null)
  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const [speed, setSpeedState] = useState(1)
  const speedRef = useRef(1)
  const setSpeed = (v: number) => { speedRef.current = v; setSpeedState(v) }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms / speedRef.current))

  const commit = (t: AVLTreeNode | null) => {
    treeRef.current = t
    setTreeState(t)
  }

  const insert = async (value: number) => {
    if (isNaN(value) || isAnimating) return
    setIsAnimating(true)
    setLastMessage(`Inserting ${value}...`)

    if (voiceEnabled) await playNarration(`Inserting value ${value} into the AVL tree.`)

    const working = cloneTree(treeRef.current)
    let inserted = false
    let rotationsThisInsert = 0

    async function insertRec(node: AVLTreeNode | null): Promise<AVLTreeNode> {
      if (!node) {
        inserted = true
        const newNode: AVLTreeNode = { id: `node-${nodeIdCounter++}`, value, left: null, right: null, height: 1 }
        return newNode
      }

      setHighlightedNodes([node.id])
      stepSound()
      await sleep(450)

      if (value < node.value) {
        node.left = await insertRec(node.left)
      } else if (value > node.value) {
        node.right = await insertRec(node.right)
      } else {
        // duplicate value — no-op, but still surface it to the user
        return node
      }

      updateHeight(node)
      const bf = balanceFactor(node)

      const showRotation = async (type: RotationType, involved: string[], rotate: () => AVLTreeNode) => {
        setRotatingNodes(involved)
        setLastMessage(`Balance factor ${bf} at ${node.value} — performing a ${type} rotation.`)
        if (voiceEnabled) await playNarration(`Node ${node.value} is unbalanced. Performing a ${type} rotation.`)
        stepSound()
        await sleep(650)

        const rotated = rotate()
        commit(cloneTree(working))
        await sleep(500)

        setRotatingNodes([])
        rotationsThisInsert++
        setRotationCount((c) => c + 1)
        setRotationHistory((h) => [...h, { type, atValue: node.value }])
        return rotated
      }

      // Left-heavy
      if (bf > 1) {
        if (value < node.left!.value) {
          // LL case
          return await showRotation("LL", [node.id, node.left!.id], () => rightRotate(node))
        } else {
          // LR case
          return await showRotation("LR", [node.id, node.left!.id, node.left!.right!.id], () => {
            node.left = leftRotate(node.left!)
            return rightRotate(node)
          })
        }
      }

      // Right-heavy
      if (bf < -1) {
        if (value > node.right!.value) {
          // RR case
          return await showRotation("RR", [node.id, node.right!.id], () => leftRotate(node))
        } else {
          // RL case
          return await showRotation("RL", [node.id, node.right!.id, node.right!.left!.id], () => {
            node.right = rightRotate(node.right!)
            return leftRotate(node)
          })
        }
      }

      return node
    }

    function rightRotate(y: AVLTreeNode): AVLTreeNode {
      const x = y.left!
      const T2 = x.right
      x.right = y
      y.left = T2
      updateHeight(y)
      updateHeight(x)
      return x
    }

    function leftRotate(x: AVLTreeNode): AVLTreeNode {
      const y = x.right!
      const T2 = y.left
      y.left = x
      x.right = T2
      updateHeight(x)
      updateHeight(y)
      return y
    }

    try {
      const newRoot = await insertRec(working)
      commit(newRoot)

      if (!inserted) {
        setLastMessage(`${value} already exists in the tree — duplicates are ignored.`)
      } else if (rotationsThisInsert === 0) {
        setLastMessage(`Inserted ${value} — tree stayed balanced, no rotation needed.`)
      } else {
        setLastMessage(`Inserted ${value} — ${rotationsThisInsert} rotation${rotationsThisInsert > 1 ? "s" : ""} performed to restore balance.`)
      }
    } finally {
      setHighlightedNodes([])
      setRotatingNodes([])
      setIsAnimating(false)
      endSound()
      showEndMessage("Algorithm ended", "Node inserted into AVL tree.")
    }
  }

  const traverseWithAnimation = async (
    node: AVLTreeNode | null,
    order: "inorder" | "preorder" | "postorder"
  ) => {
    if (!node) return

    const highlight = async (id: string, value: number) => {
      setHighlightedNodes((prev) => [...prev, id])
      setTraversalHistory((prev) => [...prev, value])
      stepSound()
      await sleep(700)
      setHighlightedNodes((prev) => prev.filter((n) => n !== id))
    }

    if (order === "preorder") {
      await highlight(node.id, node.value)
      if (node.left) await traverseWithAnimation(node.left, order)
      if (node.right) await traverseWithAnimation(node.right, order)
    } else if (order === "inorder") {
      if (node.left) await traverseWithAnimation(node.left, order)
      await highlight(node.id, node.value)
      if (node.right) await traverseWithAnimation(node.right, order)
    } else {
      if (node.left) await traverseWithAnimation(node.left, order)
      if (node.right) await traverseWithAnimation(node.right, order)
      await highlight(node.id, node.value)
    }
  }

  const runTraversal = async (order: "inorder" | "preorder" | "postorder") => {
    if (isAnimating || !treeRef.current) return
    setIsAnimating(true)
    setHighlightedNodes([])
    setTraversalHistory([])

    if (voiceEnabled) await playNarration(`Starting ${order} traversal of the AVL tree.`)

    try {
      await traverseWithAnimation(treeRef.current, order)
    } finally {
      setTimeout(() => {
        setIsAnimating(false)
        endSound()
        showEndMessage("Algorithm ended", `${order[0].toUpperCase()}${order.slice(1)} traversal completed.`)
      }, 400)
    }
  }

  const clear = () => {
    commit(null)
    setHighlightedNodes([])
    setRotatingNodes([])
    setTraversalHistory([])
    setIsAnimating(false)
    setLastMessage("")
    setRotationCount(0)
    setRotationHistory([])
    nodeIdCounter = 0
  }

  return {
    tree,
    highlightedNodes,
    rotatingNodes,
    traversalHistory,
    isAnimating,
    lastMessage,
    rotationCount,
    rotationHistory,
    insert,
    clear,
    inorderTraversal: () => runTraversal("inorder"),
    preorderTraversal: () => runTraversal("preorder"),
    postorderTraversal: () => runTraversal("postorder"),
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
  }
}
