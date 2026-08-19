"use client"

import { BinaryTreeVisualizer } from "@/components/visualizer/binary-tree/binary-tree-visualizer"
import Content from "./binary-tree.mdx"
import HeapContent from "../heap/heap.mdx"

export default function BinaryTreePage() {
  return <BinaryTreeVisualizer content={<Content />} heapContent={<HeapContent />} />
}
