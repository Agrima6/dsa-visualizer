"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { LinkedListDisplay } from "@/components/visualizer/linked-list/linked-list-display"
import { LinkedListControls } from "@/components/visualizer/linked-list/linked-list-controls"
import { LinkedListOperations } from "@/components/visualizer/linked-list/linked-list-operations"
import { useLinkedList } from "@/hooks/use-linked-list"
import { ListType } from "./types"
import LinkedListCodeView from "./linked-list-code-view"

const LIST_TYPES: { value: ListType; label: string }[] = [
  { value: 'SLL', label: 'SLL' },
  { value: 'DLL', label: 'DLL' },
  { value: 'CSLL', label: 'CSLL' },
  { value: 'CDLL', label: 'CDLL' },
]

interface LinkedListVisualizerProps {
  content: React.ReactNode
}

function LinkedListVisualizerInner({ content }: LinkedListVisualizerProps) {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  // ✅ If mode=code, render the problems/code view
  if (mode === "code") {
    return <LinkedListCodeView />
  }

  return (
    <div className="container mx-auto space-y-8">

      {/* HERO TITLE CONTAINER */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        
        {/* glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        {/* content */}
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Linked List Visualization
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Explore how nodes are connected through pointers and how insertion,
            deletion, and traversal work step by step.
          </p>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="SLL" className="w-full space-y-6">

        {/* TAB LIST */}
        <TabsList className="grid w-full grid-cols-5 rounded-2xl border border-violet-500/15 bg-white/60 backdrop-blur-xl dark:bg-white/[0.04] p-1">
          {LIST_TYPES.map(type => (
            <TabsTrigger
              key={type.value}
              value={type.value}
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {type.label}
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="explanation"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Info
          </TabsTrigger>
        </TabsList>

        {/* VISUALIZATION TABS */}
        {LIST_TYPES.map(type => (
          <TabsContent key={type.value} value={type.value} className="space-y-6">
            <LinkedListContent type={type.value} />
          </TabsContent>
        ))}

        {/* EXPLANATION TAB */}
        <TabsContent value="explanation" className="prose prose-invert max-w-none">
          <MarkdownContent content={content} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export function LinkedListVisualizer({ content }: LinkedListVisualizerProps) {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 text-muted-foreground">Loading...</div>}>
      <LinkedListVisualizerInner content={content} />
    </Suspense>
  )
}

function LinkedListContent({ type }: { type: ListType }) {
  const {
    list,
    operations,
    animationState,
    isAnimating,
    insertFront,
    insertBack,
    deleteFront,
    deleteBack,
    reverse,
  } = useLinkedList(type)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* LEFT PANEL */}
      <div className="xl:col-span-1 space-y-6">
        <LinkedListControls 
          onInsertFront={insertFront}
          onInsertBack={insertBack}
          onDeleteFront={deleteFront}
          onDeleteBack={deleteBack}
          onReverse={reverse}
          isAnimating={isAnimating}
          isEmpty={!list.head}
        />
        <LinkedListOperations operations={operations} />
      </div>

      {/* RIGHT DISPLAY */}
      <div className="xl:col-span-2">
        <LinkedListDisplay 
          list={list}
          highlightedNodes={animationState.highlightedNodes}
          message={animationState.message}
        />
      </div>
    </div>
  )
}