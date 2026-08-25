"use client"
// components/visualizer/dp/dp-visualizer.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDP } from "@/hooks/use-dp"
import { DPControls } from "./dp-controls"
import { DPGrid } from "./dp-grid"
import { DPUnderstand } from "./dp-understand"
import { Sparkles } from "lucide-react"

export function DPVisualizer() {
  const {
    problem, setProblem,
    items, setItems,
    capacity, setCapacity,
    strA, setStrA,
    strB, setStrB,
    voiceEnabled, setVoiceEnabled,
    speed, setSpeed,
    table, status, rowLabels, colLabels,
    message, isAnimating, resultLabel,
    run, reset,
  } = useDP()

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
            Dynamic Programming
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Dynamic Programming Visualizer
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Watch a DP table fill cell by cell for 0/1 Knapsack and Longest Common
            Subsequence, then trace the backtracked answer through the grid.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="understand" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-violet-500/12 bg-white/65 p-1 backdrop-blur-lg dark:bg-white/[0.04]">
          <TabsTrigger value="understand" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Understand
          </TabsTrigger>
          <TabsTrigger value="visualization" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Visualization
          </TabsTrigger>
        </TabsList>

        {/* UNDERSTAND */}
        <TabsContent value="understand">
          <DPUnderstand />
        </TabsContent>

        {/* VISUALIZATION */}
        <TabsContent value="visualization" className="space-y-6">
          {(message || resultLabel) && (
            <div className="space-y-2">
              {message && (
                <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 px-4 py-3 text-sm text-violet-700 dark:text-violet-300">
                  {message}
                </div>
              )}
              {resultLabel && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {resultLabel}
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-1 space-y-6">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <DPControls
                  problem={problem}
                  onSetProblem={setProblem}
                  items={items}
                  onSetItems={setItems}
                  capacity={capacity}
                  onSetCapacity={setCapacity}
                  strA={strA}
                  onSetStrA={setStrA}
                  strB={strB}
                  onSetStrB={setStrB}
                  isAnimating={isAnimating}
                  onRun={run}
                  onReset={reset}
                  voiceEnabled={voiceEnabled}
                  onSetVoiceEnabled={setVoiceEnabled}
                  speed={speed}
                  onSetSpeed={setSpeed}
                />
              </div>
              <div className="rounded-2xl border border-violet-500/15 bg-white/60 p-4 text-xs text-muted-foreground dark:bg-white/[0.03]">
                <p className="mb-2 font-semibold uppercase tracking-[0.14em] text-violet-500">Legend</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-md border border-amber-400 bg-gradient-to-br from-amber-500/40 to-orange-500/40" />
                    Cell being computed right now
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-md border border-violet-500/20 bg-white/70 dark:bg-white/10" />
                    Filled subproblem answer
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-md border border-emerald-400 bg-gradient-to-br from-emerald-500/40 to-teal-500/40" />
                    Backtracked path to the final answer
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-2">
              <DPGrid table={table} status={status} rowLabels={rowLabels} colLabels={colLabels} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
