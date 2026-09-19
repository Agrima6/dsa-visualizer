"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Swords } from "lucide-react"
import { ArraySortPanel } from "@/components/code-playground/panels/array-sort-panel"
import { TreePanel } from "@/components/code-playground/panels/tree-panel"
import { LinkedListPanel } from "@/components/code-playground/panels/linked-list-panel"
import { StackQueuePanel } from "@/components/code-playground/panels/stack-queue-panel"

type TabId = "array" | "tree" | "linked-list" | "stack-queue"

const TABS: { id: TabId; label: string; description: string }[] = [
  {
    id: "array",
    label: "Array & Sorting",
    description: "Write a function that takes an array, and watch your comparisons, swaps, and writes animate on a bar chart.",
  },
  {
    id: "tree",
    label: "Binary Tree",
    description: "Write a binary search tree insert function — recursive or iterative — and watch it walk the tree in real time.",
  },
  {
    id: "linked-list",
    label: "Linked List",
    description: "Write a singly-linked list function and watch your pointer move through the chain via .next.",
  },
  {
    id: "stack-queue",
    label: "Stack & Queue",
    description: "Write a function that uses a plain array as a stack or queue, and watch push/pop/shift/unshift animate.",
  },
]

export default function CodePlaygroundPage() {
  const [tab, setTab] = useState<TabId>("array")

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("tab")
    if (param && TABS.some((t) => t.id === param)) setTab(param as TabId)
  }, [])

  const setTabAndUrl = (id: TabId) => {
    setTab(id)
    const url = new URL(window.location.href)
    url.searchParams.set("tab", id)
    window.history.replaceState(null, "", url)
  }

  const active = TABS.find((t) => t.id === tab)!

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Code Playground</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every other visualizer here animates a reference implementation — this one animates yours.
          Pick a data structure below, write your own function, and run it entirely in your browser in
          a sandboxed worker. Nothing is sent to a server.
        </p>
        <Link
          href="/visualizer/battle"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:underline dark:text-violet-300"
        >
          <Swords className="h-3.5 w-3.5" />
          Race a friend head-to-head in Code Battle →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTabAndUrl(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-violet-600 text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{active.description}</p>

      {tab === "array" && <ArraySortPanel />}
      {tab === "tree" && <TreePanel />}
      {tab === "linked-list" && <LinkedListPanel />}
      {tab === "stack-queue" && <StackQueuePanel />}
    </div>
  )
}
