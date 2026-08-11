"use client"
// components/visualizer/recursion/recursion-visualizer.tsx
//
// Unlike the other topics, Recursion has no separate "live demo" mode —
// it exists specifically as a Company Questions category, so it always
// renders the problems browser regardless of the ?mode= query param.

import RecursionCodeView from "./recursion-code-view"

export default function RecursionVisualizer() {
  return <RecursionCodeView />
}
