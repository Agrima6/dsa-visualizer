"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { TOPICS } from "@/lib/visualizer-topics"

const staticLinks = [
  { name: "Dashboard", href: "/dashboard", hint: "Page" },
  { name: "Company Questions", href: "/company-questions", hint: "Page" },
  { name: "About Us", href: "/about", hint: "Page" },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const topicResults = TOPICS.map((t) => ({ name: t.name, href: t.href, hint: "Visualizer" }))
    const all = [...topicResults, ...staticLinks]
    if (!q) return all.slice(0, 8)
    return all.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => setActiveIndex(0), [query])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = results[activeIndex]
      if (item) go(item.href)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 rounded-xl border border-violet-500/15 bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-violet-500/30 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search topics</span>
        <kbd className="ml-3 rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[20%] max-w-lg translate-y-0 gap-0 overflow-hidden rounded-2xl border-violet-500/15 p-0 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>Search topics</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search topics, e.g. AVL, Trie, Graph..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matches.</p>
            ) : (
              results.map((item, i) => (
                <button
                  key={item.href + item.name}
                  onClick={() => go(item.href)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    i === activeIndex ? "bg-violet-500/10 text-violet-600 dark:text-violet-300" : "text-foreground"
                  }`}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground/60">{item.hint}</span>
                </button>
              ))
            )}
          </div>
          <div className="flex items-center gap-4 border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground/70">
            <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" /> Navigate</span>
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> Open</span>
            <span className="ml-auto">Esc to close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
