import { useState, useRef } from "react"
import { BinaryTreeNode } from "@/components/visualizer/binary-tree/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"
import { playNarration } from "@/lib/narration"

let nodeIdCounter = 0

export function useBinaryTree(mode: "bst" | "generic" = "bst") {
  const [tree, setTreeState] = useState<BinaryTreeNode | null>(null)
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [traversalHistory, setTraversalHistory] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  // Bulk insert calls `insert` several times in a row (awaiting each), all
  // from a single event handler closure that was created with whatever
  // `insert` looked like at that render. Reading `tree` (the state
  // variable) inside `insert` would keep seeing that render's stale
  // snapshot across the whole loop, so every insert after the first would
  // silently overwrite instead of add to the tree. This ref always holds
  // the true latest tree, independent of which render's closure is running.
  const treeRef = useRef<BinaryTreeNode | null>(null)
  const setTree = (t: BinaryTreeNode | null) => {
    treeRef.current = t
    setTreeState(t)
  }

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const insert = async (value: number) => {
    if (isNaN(value) || isAnimating) return

    setIsAnimating(true)

    if (voiceEnabled) {
      await playNarration(`Inserting value ${value} into the binary tree.`)
    }

    const newNode: BinaryTreeNode = {
      id: `node-${nodeIdCounter++}`,
      value,
      left: null,
      right: null,
    }

    if (!treeRef.current) {
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

    const currentTree: BinaryTreeNode = treeRef.current

    // BST insertion: ordered by value, like the original behavior.
    const insertBST = async (node: BinaryTreeNode): Promise<BinaryTreeNode> => {
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
          left: await insertBST(node.left),
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
          right: await insertBST(node.right),
        }
      }
    }

    // Generic binary tree insertion: no ordering rule at all — the new
    // node just goes in the next open slot in level order (top-to-bottom,
    // left-to-right), same as building a complete tree. This is what
    // actually distinguishes a plain binary tree from a BST.
    const insertLevelOrder = async (root: BinaryTreeNode): Promise<BinaryTreeNode> => {
      const cloneNode = (n: BinaryTreeNode): BinaryTreeNode => ({ ...n, left: n.left ? cloneNode(n.left) : null, right: n.right ? cloneNode(n.right) : null })
      const clonedRoot = cloneNode(root)
      const queue: BinaryTreeNode[] = [clonedRoot]

      while (queue.length > 0) {
        const node = queue.shift()!
        setHighlightedNodes([node.id])
        stepSound()
        await new Promise((resolve) => setTimeout(resolve, 400))

        if (!node.left) {
          setHighlightedNodes([node.id, newNode.id])
          stepSound()
          await new Promise((resolve) => setTimeout(resolve, 500))
          node.left = newNode
          return clonedRoot
        }
        if (!node.right) {
          setHighlightedNodes([node.id, newNode.id])
          stepSound()
          await new Promise((resolve) => setTimeout(resolve, 500))
          node.right = newNode
          return clonedRoot
        }

        queue.push(node.left, node.right)
      }

      return clonedRoot
    }

    try {
      const updatedTree = mode === "generic" ? await insertLevelOrder(currentTree) : await insertBST(currentTree)
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

    if (voiceEnabled) {
      await playNarration("Starting inorder traversal of the binary tree.")
    }

    try {
      await traverseWithAnimation(
        tree,
        () => {},
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

    if (voiceEnabled) {
      await playNarration("Starting preorder traversal of the binary tree.")
    }

    try {
      await traverseWithAnimation(
        tree,
        () => {},
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

    if (voiceEnabled) {
      await playNarration("Starting postorder traversal of the binary tree.")
    }

    try {
      await traverseWithAnimation(
        tree,
        () => {},
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
    voiceEnabled,
    setVoiceEnabled,
  }
}