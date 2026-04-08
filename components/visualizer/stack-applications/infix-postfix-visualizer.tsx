"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useInfixConversion } from "@/hooks/use-infix-conversion"
import { ConversionSteps } from "./conversion-steps"
import { Token } from "./types"
import { PostfixEvaluation } from "./postfix-evaluation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"
import { Sparkles } from "lucide-react"

const EXAMPLE_EXPRESSION = "K+L-M*N+(O^P)*W/U/V*T+Q"

interface InfixPostfixVisualizerProps {
  content: React.ReactNode
}

export function InfixPostfixVisualizer({ content }: InfixPostfixVisualizerProps) {
  const [expression, setExpression] = useState("")
  const { steps, isConverting, result, convert } = useInfixConversion()
  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()
  const wasConvertingRef = useRef(false)

  useEffect(() => {
    if (isConverting) {
      wasConvertingRef.current = true
      stepSound()
    } else if (wasConvertingRef.current && steps.length > 0) {
      wasConvertingRef.current = false
      endSound()
      showEndMessage("Algorithm ended", "Infix to Postfix conversion completed.")
    }
  }, [isConverting, steps.length, stepSound, endSound, showEndMessage])

  const handleConvert = () => {
    if (!expression.trim() || isConverting) return
    convert(expression)
  }

  const formatResult = (tokens: Token[]) => {
    return tokens.map((t) => t.value).join(" ")
  }

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
            Stack Application
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Infix to Postfix Conversion
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Convert infix expressions to postfix notation step by step using a stack,
            and understand operator precedence visually.
          </p>
        </div>
      </div>

      <Tabs defaultValue="conversion" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-violet-500/12 bg-white/65 p-1 backdrop-blur-lg dark:bg-white/[0.04]">
          <TabsTrigger
            value="conversion"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Conversion
          </TabsTrigger>

          <TabsTrigger
            value="evaluation"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Evaluation
          </TabsTrigger>

          <TabsTrigger
            value="explanation"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Explanation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversion" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-1 space-y-6">
              <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <CardHeader>
                  <CardTitle className="text-violet-700 dark:text-violet-300">
                    Expression Input
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Input
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="Enter infix expression (e.g., 3+4*2)"
                    onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                    disabled={isConverting}
                    className="rounded-xl border-violet-500/20 focus-visible:ring-violet-500"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={handleConvert}
                      disabled={isConverting || !expression.trim()}
                      className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)]"
                    >
                      Convert to Postfix
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setExpression(EXAMPLE_EXPRESSION)}
                      disabled={isConverting}
                      className="rounded-xl border-violet-500/20 hover:bg-violet-500/5"
                    >
                      Use Example
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {result.length > 0 && (
                <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                  <CardHeader>
                    <CardTitle className="text-violet-700 dark:text-violet-300">
                      Result
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="rounded-2xl border border-violet-500/10 bg-white/70 p-4 font-mono break-all dark:bg-white/[0.03]">
                      {formatResult(result)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="xl:col-span-2">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <ConversionSteps steps={steps} currentExpression={expression} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-6">
          {result.length > 0 ? (
            <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
              <PostfixEvaluation expression={result} />
            </div>
          ) : (
            <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
              <CardContent className="py-8 text-center text-muted-foreground">
                Convert an infix expression first to see its evaluation
              </CardContent>
            </Card>
          )}
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