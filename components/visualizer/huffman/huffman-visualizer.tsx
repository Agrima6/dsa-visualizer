"use client"

import { HuffmanControls } from "./huffman-controls"
import { HuffmanDisplay } from "./huffman-display"
import { HuffmanAnalysis } from "./huffman-analysis"
import { HuffmanCodes } from "./huffman-codes"
import { CompressionDisplay } from "./compression-display"
import { FrequencyList } from "./frequency-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useHuffman } from "@/hooks/use-huffman"
import { useStepFeedback } from "@/hooks/use-step-feedback"
import { Sparkles } from "lucide-react"

interface HuffmanVisualizerProps {
  content: React.ReactNode
}

export function HuffmanVisualizer({ content }: HuffmanVisualizerProps) {
  const {
    tree,
    steps,
    currentStep,
    highlightedNodes,
    codes,
    isAnimating,
    buildHuffmanTree,
    nextStep,
    previousStep,
    reset,
    originalText,
    frequencies,
  } = useHuffman()

  useStepFeedback(currentStep, steps.length, "Huffman Coding")

  return (
    <div className="container mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Compression Algorithm
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Huffman Coding
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            A data compression technique that assigns variable-length codes to
            characters based on their frequencies.
          </p>
        </div>
      </div>

      <Tabs defaultValue="visualization" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-violet-500/12 bg-white/65 p-1 backdrop-blur-lg dark:bg-white/[0.04]">
          <TabsTrigger
            value="visualization"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Visualization
          </TabsTrigger>

          <TabsTrigger
            value="analysis"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Analysis
          </TabsTrigger>

          <TabsTrigger
            value="explanation"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Explanation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
            <div className="space-y-6 xl:sticky xl:top-6 self-start">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <HuffmanControls
                  onEncode={buildHuffmanTree}
                  onNext={nextStep}
                  onPrevious={previousStep}
                  onReset={reset}
                  isAnimating={isAnimating}
                  currentStep={currentStep}
                  totalSteps={steps.length}
                />
              </div>

              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <HuffmanCodes codes={codes} />
              </div>

              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <CompressionDisplay
                  originalText={originalText}
                  codes={codes}
                />
              </div>
            </div>

            <div className="space-y-6 min-w-0">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <HuffmanDisplay
                  tree={tree}
                  highlightedNodes={highlightedNodes}
                  message={steps[currentStep]?.message || ""}
                />
              </div>

              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <FrequencyList
                  frequencies={frequencies}
                  totalChars={originalText.length}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <HuffmanAnalysis tree={tree} codes={codes} />
          </div>
        </TabsContent>

        <TabsContent value="explanation">
          <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <MarkdownContent content={content} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}