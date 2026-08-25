"use client"
// hooks/use-trie.ts

import { useCallback, useRef, useState } from "react"
import { playNarration, stopNarration } from "@/lib/narration"
import type { TrieNode } from "@/components/visualizer/trie/types"

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms))
}

function makeRoot(): TrieNode {
  return { id: "root", char: "•", isEndOfWord: false, children: {} }
}

function cloneTrie(node: TrieNode): TrieNode {
  const children: Record<string, TrieNode> = {}
  for (const key of Object.keys(node.children)) {
    children[key] = cloneTrie(node.children[key])
  }
  return { ...node, children }
}

export function useTrie() {
  const [root, setRoot] = useState<TrieNode>(makeRoot())
  const [words, setWords] = useState<string[]>([])
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [matchedNodes, setMatchedNodes] = useState<string[]>([])
  const [missNode, setMissNode] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const speed = 420 / speedMultiplier
  const [lastResult, setLastResult] = useState<{ type: "search" | "prefix"; word: string; found: boolean } | null>(null)

  const rootRef = useRef<TrieNode>(root)
  const wordsRef = useRef<string[]>([])

  const commit = useCallback((r: TrieNode) => {
    rootRef.current = r
    setRoot(cloneTrie(r))
  }, [])

  const insert = useCallback(async (rawWord: string) => {
    const word = rawWord.trim().toLowerCase().replace(/[^a-z]/g, "")
    if (!word || isAnimating) return
    setIsAnimating(true)
    setMatchedNodes([])
    setMissNode(null)
    const working = cloneTrie(rootRef.current)

    let node = working
    const path: string[] = [node.id]
    if (voiceEnabled) await playNarration(`Inserting ${word}.`)

    for (const ch of word) {
      if (!node.children[ch]) {
        node.children[ch] = { id: `${node.id}-${ch}`, char: ch, isEndOfWord: false, children: {} }
        setMessage(`Creating new node for '${ch}'.`)
      } else {
        setMessage(`Node for '${ch}' already exists — reusing it.`)
      }
      node = node.children[ch]
      path.push(node.id)
      setHighlightedNodes([...path])
      commit(working)
      await sleep(speed)
    }
    node.isEndOfWord = true
    commit(working)
    setHighlightedNodes([...path])
    setMessage(`Marked end of word at '${word[word.length - 1]}'. "${word}" inserted.`)
    if (!wordsRef.current.includes(word)) {
      wordsRef.current = [...wordsRef.current, word].sort()
      setWords(wordsRef.current)
    }
    await sleep(speed)
    setHighlightedNodes([])
    setIsAnimating(false)
  }, [isAnimating, speed, voiceEnabled, commit])

  const traverse = useCallback(async (rawWord: string, mode: "search" | "prefix") => {
    const word = rawWord.trim().toLowerCase().replace(/[^a-z]/g, "")
    if (!word || isAnimating) return
    setIsAnimating(true)
    setHighlightedNodes([])
    setMatchedNodes([])
    setMissNode(null)

    let node: TrieNode | undefined = rootRef.current
    const path: string[] = [node.id]
    let found = true

    if (voiceEnabled) await playNarration(mode === "search" ? `Searching for ${word}.` : `Checking prefix ${word}.`)

    for (const ch of word) {
      const next: TrieNode | undefined = node?.children[ch]
      if (!next) {
        found = false
        setMissNode(`${node!.id}-${ch}`)
        setMessage(`No node for '${ch}' from here — "${word}" not found.`)
        await sleep(speed)
        break
      }
      node = next
      path.push(node.id)
      setMatchedNodes([...path])
      setMessage(`Following '${ch}'...`)
      await sleep(speed)
    }

    const exists = found && (mode === "prefix" || !!node?.isEndOfWord)
    setLastResult({ type: mode, word, found: exists })
    setMessage(
      mode === "search"
        ? exists
          ? `"${word}" is a complete word in the trie.`
          : found
            ? `"${word}" exists as a path but isn't marked as a full word.`
            : `"${word}" is not in the trie.`
        : exists
          ? `"${word}" is a valid prefix in the trie.`
          : `"${word}" is not a prefix of anything in the trie.`
    )
    if (voiceEnabled) await playNarration(exists ? "Found it." : "Not found.")
    await sleep(speed / 2)
    setIsAnimating(false)
  }, [isAnimating, speed, voiceEnabled])

  const clear = useCallback(() => {
    if (isAnimating) return
    stopNarration()
    wordsRef.current = []
    setWords([])
    commit(makeRoot())
    setHighlightedNodes([])
    setMatchedNodes([])
    setMissNode(null)
    setMessage("")
    setLastResult(null)
  }, [isAnimating, commit])

  return {
    root, words, highlightedNodes, matchedNodes, missNode,
    message, isAnimating, lastResult,
    voiceEnabled, setVoiceEnabled, speed: speedMultiplier, setSpeed: setSpeedMultiplier,
    insert, search: (w: string) => traverse(w, "search"),
    startsWith: (w: string) => traverse(w, "prefix"),
    clear,
  }
}
