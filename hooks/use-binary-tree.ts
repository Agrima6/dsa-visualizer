import { useState } from "react"
import { BinaryTreeNode } from "@/components/visualizer/binary-tree/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"

let nodeIdCounter = 0

export function useBinaryTree() {
  const [tree, setTree] = useState<BinaryTreeNode | null>(null)
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [traversalHistory, setTraversalHistory] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const insert = async (value: number) => {
    if (isNaN(value) || isAnimating) return

    setIsAnimating(true)

    const newNode: BinaryTreeNode = {
      id: `node-${nodeIdCounter++}`,
      value,
      left: null,
      right: null,
    }

    if (!tree) {
      setHighlightedNodes([newNode.id])
      stepSound()
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTree(newNode)
      setHighlightedNodes([])
      setIsAnimating(false)

      endSound()
      showEndMessage("Algorithm ended", "Node inserted into Binary Tree.")
      return
    }

    const insertIntoTree = async (node: BinaryTreeNode): Promise<BinaryTreeNode> => {
      setHighlightedNodes([node.id])
      stepSound()
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (value <= node.value) {
        if (!node.left) {
          setHighlightedNodes([node.id, newNode.id])
          stepSound()
          await new Promise((resolve) => setTimeout(resolve, 500))

          return {
            ...node,
            left: newNode,
          }
        }

        return {
          ...node,
          left: await insertIntoTree(node.left),
        }
      } else {
        if (!node.right) {
          setHighlightedNodes([node.id, newNode.id])
          stepSound()
          await new Promise((resolve) => setTimeout(resolve, 500))

          return {
            ...node,
            right: newNode,
          }
        }

        return {
          ...node,
          right: await insertIntoTree(node.right),
        }
      }
    }

    try {
      const updatedTree = await insertIntoTree(tree)
      setTree(updatedTree)
    } finally {
      setHighlightedNodes([])
      setIsAnimating(false)
      endSound()
      showEndMessage("Algorithm ended", "Node inserted into Binary Tree.")
    }
  }

  const traverseWithAnimation = async (
    node: BinaryTreeNode | null,
    visit: (node: BinaryTreeNode) => void,
    order: "inorder" | "preorder" | "postorder"
  ) => {
    if (!node) return

    const highlight = async (nodeId: string, value: number) => {
      setHighlightedNodes((prev) => [...prev, nodeId])
      setTraversalHistory((prev) => [...prev, value])
      stepSound()

      await new Promise((resolve) => setTimeout(resolve, 800))

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
    setIsAnimating(false)
    nodeIdCounter = 0
  }

  const inorderTraversal = async () => {
    if (isAnimating || !tree) return

    setIsAnimating(true)
    setHighlightedNodes([])
    setTraversalHistory([])

    try {
      await traverseWithAnimation(
        tree,
        (node) => {
          console.log("Visiting:", node.value)
        },
        "inorder"
      )
    } finally {
      setTimeout(() => {
        setIsAnimating(false)
        endSound()
        showEndMessage("Algorithm ended", "Inorder traversal completed.")
      }, 500)
    }
  }

  const preorderTraversal = async () => {
    if (isAnimating || !tree) return

    setIsAnimating(true)
    setHighlightedNodes([])
    setTraversalHistory([])

    try {
      await traverseWithAnimation(
        tree,
        (node) => {
          console.log("Visiting:", node.value)
        },
        "preorder"
      )
    } finally {
      setTimeout(() => {
        setIsAnimating(false)
        endSound()
        showEndMessage("Algorithm ended", "Preorder traversal completed.")
      }, 500)
    }
  }

  const postorderTraversal = async () => {
    if (isAnimating || !tree) return

    setIsAnimating(true)
    setHighlightedNodes([])
    setTraversalHistory([])

    try {
      await traverseWithAnimation(
        tree,
        (node) => {
          console.log("Visiting:", node.value)
        },
        "postorder"
      )
    } finally {
      setTimeout(() => {
        setIsAnimating(false)
        endSound()
        showEndMessage("Algorithm ended", "Postorder traversal completed.")
      }, 500)
    }
  }

  return {
    tree,
    highlightedNodes,
    traversalHistory,
    isAnimating,
    insert,
    clear,
    inorderTraversal,
    preorderTraversal,
    postorderTraversal,
  }
}