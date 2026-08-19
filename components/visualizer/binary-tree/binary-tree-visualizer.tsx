"use client"
// components/visualizer/binary-tree/binary-tree-visualizer.tsx

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { BinaryTreeControls } from "./binary-tree-controls"
import { BinaryTreeDisplay } from "./binary-tree-display"
import { BinaryTreeAnalysis } from "./binary-tree-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useBinaryTree } from "@/hooks/use-binary-tree"
import { useHeap } from "@/hooks/use-heap"
import { HeapControls } from "@/components/visualizer/heap/heap-controls"
import { HeapDisplay } from "@/components/visualizer/heap/heap-display"
import { HeapArray } from "@/components/visualizer/heap/heap-array"
import { Sparkles } from "lucide-react"
import BinaryTreeCodeView from "./Binary tree code view"

interface BinaryTreeVisualizerProps {
  content: React.ReactNode
  heapContent: React.ReactNode
}

// ── Router: switches between normal visualizer and code-problems view ──
function BinaryTreeVisualizerInner({ content, heapContent }: BinaryTreeVisualizerProps) {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  if (mode === "code") {
    return <BinaryTreeCodeView />
  }

  return <BinaryTreeVisualizerOriginal content={content} heapContent={heapContent} />
}

export function BinaryTreeVisualizer({ content, heapContent }: BinaryTreeVisualizerProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    }>
      <BinaryTreeVisualizerInner content={content} heapContent={heapContent} />
    </Suspense>
  )
}

// ── Original Visualizer ─────────────────────────────────────────
function BinaryTreeVisualizerOriginal({ content, heapContent }: BinaryTreeVisualizerProps) {
  const router = useRouter()
  const [structure, setStructure] = useState<"tree" | "bst" | "heap">("tree")

  const genericTree = useBinaryTree("generic")
  const bst = useBinaryTree("bst")

  const maxHeap = useHeap("max")
  const minHeap = useHeap("min")

  const makeTraversalHandler = (t: typeof bst) => async (type: "inorder" | "preorder" | "postorder") => {
    switch (type) {
      case "inorder":   await t.inorderTraversal();   break
      case "preorder":  await t.preorderTraversal();  break
      case "postorder": await t.postorderTraversal(); break
    }
  }

  const handleGenericTraversal = makeTraversalHandler(genericTree)
  const handleBstTraversal = makeTraversalHandler(bst)

  const codeHref = structure === "heap" ? "/visualizer/heap?mode=code" : "/visualizer/binary-tree?mode=code"

  return (
    <div className="container mx-auto space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Tree Structure
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              Binary Tree Visualization
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
              A plain Binary Tree has no ordering rule at all — a Binary Search Tree
              and a Heap are both constrained special cases of it. Explore all three
              side by side.
            </p>
          </div>

          {/* ── Try with Code button ── */}
          <button
            onClick={() => router.push(codeHref)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-blue-600/10 px-4 py-2.5 text-sm font-semibold text-violet-600 transition-all hover:from-violet-600/20 hover:to-blue-600/20 hover:shadow-[0_8px_24px_rgba(139,92,246,0.2)] dark:text-violet-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Try with Code
          </button>
        </div>
      </div>

      {/* Structure switch: Binary Tree vs BST vs Heap */}
      <Tabs value={structure} onValueChange={(v) => setStructure(v as "tree" | "bst" | "heap")} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-violet-500/12 bg-white/65 p-1 backdrop-blur-lg dark:bg-white/[0.04]">
          <TabsTrigger value="tree"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Binary Tree
          </TabsTrigger>
          <TabsTrigger value="bst"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Binary Search Tree
          </TabsTrigger>
          <TabsTrigger value="heap"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Heap
          </TabsTrigger>
        </TabsList>

        {/* ── Binary Tree (generic, no ordering rule) ── */}
        <TabsContent value="tree" className="space-y-6">
          <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <p className="text-sm leading-relaxed text-muted-foreground">
              A generic binary tree only guarantees each node has at most two children —{" "}
              <span className="font-semibold text-foreground">no ordering rule</span>. New
              nodes are placed in the next open slot, level by level, left to right. Compare
              this with the Binary Search Tree tab, where the same values would land in
              completely different positions.
            </p>
          </div>
          <Tabs defaultValue="visualization" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/60 backdrop-blur-lg border border-violet-500/10 dark:bg-white/[0.05]">
              <TabsTrigger value="visualization"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Visualization
              </TabsTrigger>
              <TabsTrigger value="analysis"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1 space-y-6">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <BinaryTreeControls
                      onInsert={genericTree.insert}
                      onClear={genericTree.clear}
                      onTraversal={handleGenericTraversal}
                      isAnimating={genericTree.isAnimating}
                      traversalHistory={genericTree.traversalHistory}
                    />
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <BinaryTreeDisplay tree={genericTree.tree} highlightedNodes={genericTree.highlightedNodes} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <BinaryTreeAnalysis tree={genericTree.tree} />
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ── BST ── */}
        <TabsContent value="bst" className="space-y-6">
          <Tabs defaultValue="visualization" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 rounded-xl bg-white/60 backdrop-blur-lg border border-violet-500/10 dark:bg-white/[0.05]">
              <TabsTrigger value="visualization"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Visualization
              </TabsTrigger>
              <TabsTrigger value="analysis"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Analysis
              </TabsTrigger>
              <TabsTrigger value="explanation"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Explanation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1 space-y-6">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <BinaryTreeControls
                      onInsert={bst.insert}
                      onClear={bst.clear}
                      onTraversal={handleBstTraversal}
                      isAnimating={bst.isAnimating}
                      traversalHistory={bst.traversalHistory}
                    />
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <BinaryTreeDisplay tree={bst.tree} highlightedNodes={bst.highlightedNodes} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <BinaryTreeAnalysis tree={bst.tree} />
              </div>
            </TabsContent>

            <TabsContent value="explanation">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <MarkdownContent content={content} />
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ── Heap ── */}
        <TabsContent value="heap" className="space-y-6">
          <Tabs defaultValue="visualization" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/60 backdrop-blur-lg border border-violet-500/10 dark:bg-white/[0.05]">
              <TabsTrigger value="visualization"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Visualization
              </TabsTrigger>
              <TabsTrigger value="explanation"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Explanation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-6">
              <Tabs defaultValue="max" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/60 backdrop-blur-lg border border-violet-500/10 dark:bg-white/[0.05]">
                  <TabsTrigger value="max" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                    Max Heap
                  </TabsTrigger>
                  <TabsTrigger value="min" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                    Min Heap
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="max" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Max Heap</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Highest priority item is always at the root.</p>
                          </div>
                          <div className="rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                            Max Heap
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                        <HeapControls title="Max Heap" onInsert={maxHeap.insert} onInsertMany={maxHeap.insertMany} onClear={maxHeap.clear} heapType={maxHeap.heapType} />
                      </div>

                      <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                        <HeapArray array={maxHeap.heapArray} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                      <HeapDisplay heap={maxHeap.heap} highlightedNodes={maxHeap.highlightedNodes} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="min" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Min Heap</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Lowest priority item is always at the root.</p>
                          </div>
                          <div className="rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                            Min Heap
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                        <HeapControls title="Min Heap" onInsert={minHeap.insert} onInsertMany={minHeap.insertMany} onClear={minHeap.clear} heapType={minHeap.heapType} />
                      </div>

                      <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                        <HeapArray array={minHeap.heapArray} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                      <HeapDisplay heap={minHeap.heap} highlightedNodes={minHeap.highlightedNodes} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="explanation">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <MarkdownContent content={heapContent} />
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
