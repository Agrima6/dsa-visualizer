import { useState } from "react"
import { AVLTreeNode } from "@/components/visualizer/avl-tree/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"

let nodeIdCounter = 0

export function useAVLTree() {
  const [tree, setTree] = useState<AVLTreeNode | null>(null)
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [traversalHistory, setTraversalHistory] = useState<number[]>([])
  const [rotationHistory, setRotationHistory] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const getHeight = (node: AVLTreeNode | null): number => {
    return node ? node.height : 0
  }

  const getBalance = (node: AVLTreeNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0
  }

  const updateHeight = (node: AVLTreeNode): number => {
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1
  }

  const rightRotate = async (y: AVLTreeNode): Promise<AVLTreeNode> => {
    setHighlightedNodes([y.id, y.left?.id || ""])
    stepSound()
    await sleep(500)

    const x = y.left!
    const T2 = x.right

    x.right = y
    y.left = T2

    y.height = updateHeight(y)
    x.height = updateHeight(x)

    setRotationHistory((prev) => [...prev, `Right rotation at ${y.value}`])
    stepSound()
    await sleep(500)

    return x
  }

  const leftRotate = async (x: AVLTreeNode): Promise<AVLTreeNode> => {
    setHighlightedNodes([x.id, x.right?.id || ""])
    stepSound()
    await sleep(500)

    const y = x.right!
    const T2 = y.left

    y.left = x
    x.right = T2

    x.height = updateHeight(x)
    y.height = updateHeight(y)

    setRotationHistory((prev) => [...prev, `Left rotation at ${x.value}`])
    stepSound()
    await sleep(500)

    return y
  }

  const insert = async (value: number) => {
    if (isNaN(value) || isAnimating) return

    setIsAnimating(true)
    setHighlightedNodes([])

    const insertNode = async (node: AVLTreeNode | null): Promise<AVLTreeNode> => {
      if (!node) {
        const newNode: AVLTreeNode = {
          id: `node-${nodeIdCounter++}`,
          value,
          height: 1,
          left: null,
          right: null,
        }

        setHighlightedNodes([newNode.id])
        stepSound()
        await sleep(500)

        return newNode
      }

      setHighlightedNodes([node.id])
      stepSound()
      await sleep(500)

      const newNode = { ...node }

      if (value < newNode.value) {
        newNode.left = await insertNode(newNode.left)
      } else {
        newNode.right = await insertNode(newNode.right)
      }

      newNode.height = 1 + Math.max(getHeight(newNode.left), getHeight(newNode.right))

      const balance = getBalance(newNode)

      // Left Left Case
      if (balance > 1 && value < newNode.left!.value) {
        return await rightRotate(newNode)
      }

      // Right Right Case
      if (balance < -1 && value >= newNode.right!.value) {
        return await leftRotate(newNode)
      }

      // Left Right Case
      if (balance > 1 && value >= newNode.left!.value) {
        newNode.left = await leftRotate(newNode.left!)
        return await rightRotate(newNode)
      }

      // Right Left Case
      if (balance < -1 && value < newNode.right!.value) {
        newNode.right = await rightRotate(newNode.right!)
        return await leftRotate(newNode)
      }

      return newNode
    }

    try {
      const updatedTree = await insertNode(tree)
      setTree(updatedTree)
    } finally {
      setHighlightedNodes([])
      setIsAnimating(false)
      endSound()
      showEndMessage("Algorithm ended", "Node inserted into AVL Tree.")
    }
  }

  const traverseWithAnimation = async (
    node: AVLTreeNode | null,
    visit: (node: AVLTreeNode) => void,
    order: "inorder" | "preorder" | "postorder"
  ) => {
    if (!node) return

    const highlight = async (nodeId: string, value: number) => {
      setHighlightedNodes((prev) => [...prev, nodeId])
      setTraversalHistory((prev) => [...prev, value])
      stepSound()

      await sleep(800)

      setHighlightedNodes((prev) => prev.filter((id) => id !== nodeId))
    }

    try {
      if (order === "preorder") {
        await highlight(node.id, node.value)
        visit(node)
        if (node.left) await traverseWithAnimation(node.left, visit, order)
        if (node.right) await traverseWithAnimation(node.right, visit, order)
      } else if (order === "inorder") {
        if (node.left) await traverseWithAnimation(node.left, visit, order)
        await highlight(node.id, node.value)
        visit(node)
        if (node.right) await traverseWithAnimation(node.right, visit, order)
      } else {
        if (node.left) await traverseWithAnimation(node.left, visit, order)
        if (node.right) await traverseWithAnimation(node.right, visit, order)
        await highlight(node.id, node.value)
        visit(node)
      }
    } catch (error) {
      console.error("Traversal error:", error)
      setIsAnimating(false)
    }
  }

  const clear = () => {
    setTree(null)
    setHighlightedNodes([])
    setTraversalHistory([])
    setRotationHistory([])
    setIsAnimating(false)
    nodeIdCounter = 0
  }

  const inorderTraversal = async () => {
    if (isAnimating || !tree) return

    setIsAnimating(true)
    setHighlightedNodes([])
    setTraversalHistory([])

    try {
      await traverseWithAnimation(tree, () => {}, "inorder")
    } finally {
      setIsAnimating(false)
      endSound()
      showEndMessage("Algorithm ended", "Inorder traversal completed.")
    }
  }

  const preorderTraversal = async () => {
    if (isAnimating || !tree) return

    setIsAnimating(true)
    setHighlightedNodes([])
    setTraversalHistory([])

    try {
      await traverseWithAnimation(tree, () => {}, "preorder")
    } finally {
      setIsAnimating(false)
      endSound()
      showEndMessage("Algorithm ended", "Preorder traversal completed.")
    }
  }

  const postorderTraversal = async () => {
    if (isAnimating || !tree) return

    setIsAnimating(true)
    setHighlightedNodes([])
    setTraversalHistory([])

    try {
      await traverseWithAnimation(tree, () => {}, "postorder")
    } finally {
      setIsAnimating(false)
      endSound()
      showEndMessage("Algorithm ended", "Postorder traversal completed.")
    }
  }

  return {
    tree,
    highlightedNodes,
    traversalHistory,
    rotationHistory,
    isAnimating,
    insert,
    clear,
    inorderTraversal,
    preorderTraversal,
    postorderTraversal,
  }
}