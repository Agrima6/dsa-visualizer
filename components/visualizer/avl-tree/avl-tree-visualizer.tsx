"use client"
// components/visualizer/avl-tree/avl-tree-visualizer.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useAVLTree } from "@/hooks/use-avl-tree"
import { BinaryTreeControls } from "@/components/visualizer/binary-tree/binary-tree-controls"
import { AVLTreeDisplay } from "./avl-tree-display"
import { AVLTreeAnalysis } from "./avl-tree-analysis"
import { AVLTreeUnderstand } from "./avl-tree-understand"
import { Sparkles } from "lucide-react"

interface AVLTreeVisualizerProps {
  content: React.ReactNode
}

export function AVLTreeVisualizer({ content }: AVLTreeVisualizerProps) {
  const {
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
    inorderTraversal,
    preorderTraversal,
    postorderTraversal,
  } = useAVLTree()

  const handleTraversal = async (type: "inorder" | "preorder" | "postorder") => {
    switch (type) {
      case "inorder":   await inorderTraversal();   break
      case "preorder":  await preorderTraversal();  break
      case "postorder": await postorderTraversal(); break
    }
  }

  return (
    <div className="container mx-auto space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Self-Balancing Tree
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            AVL Tree Visualization
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            A Binary Search Tree that rebalances itself on every insert. Watch the
            balance factor on each node, and see LL / RR / LR / RL rotations fire in
            real time.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="understand" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl border border-violet-500/12 bg-white/65 p-1 backdrop-blur-lg dark:bg-white/[0.04]">
          <TabsTrigger value="understand" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Understand
          </TabsTrigger>
          <TabsTrigger value="visualization" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Visualization
          </TabsTrigger>
          <TabsTrigger value="analysis" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Analysis
          </TabsTrigger>
          <TabsTrigger value="explanation" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Explanation
          </TabsTrigger>
        </TabsList>

        {/* UNDERSTAND */}
        <TabsContent value="understand">
          <AVLTreeUnderstand />
        </TabsContent>

        {/* VISUALIZATION */}
        <TabsContent value="visualization" className="space-y-6">
          {lastMessage && (
            <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 px-4 py-3 text-sm text-violet-700 dark:text-violet-300">
              {lastMessage}
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-1 space-y-6">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <BinaryTreeControls
                  onInsert={insert}
                  onClear={clear}
                  onTraversal={handleTraversal}
                  isAnimating={isAnimating}
                  traversalHistory={traversalHistory}
                />
              </div>
              <div className="rounded-2xl border border-violet-500/15 bg-white/60 p-4 text-xs text-muted-foreground dark:bg-white/[0.03]">
                <p className="mb-2 font-semibold uppercase tracking-[0.14em] text-violet-500">Legend</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-emerald-400/60 bg-emerald-500/15" />
                    Balanced (−1, 0, +1)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-rose-400 bg-rose-500" />
                    Unbalanced (about to rotate)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-amber-400 bg-gradient-to-br from-amber-500 to-orange-500" />
                    Nodes involved in the current rotation
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-2">
              <AVLTreeDisplay tree={tree} highlightedNodes={highlightedNodes} rotatingNodes={rotatingNodes} />
            </div>
          </div>
        </TabsContent>

        {/* ANALYSIS */}
        <TabsContent value="analysis">
          <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <AVLTreeAnalysis tree={tree} rotationCount={rotationCount} rotationHistory={rotationHistory} />
          </div>
        </TabsContent>

        {/* EXPLANATION */}
        <TabsContent value="explanation">
          <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <MarkdownContent content={content} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
