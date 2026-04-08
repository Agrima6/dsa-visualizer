"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Token } from "./types"
import { usePostfixEvaluation } from "@/hooks/use-postfix-evaluation"
import { TokenDisplay } from "@/components/visualizer/stack-applications/token-display"

interface PostfixEvaluationProps {
  expression: Token[]
}

export function PostfixEvaluation({ expression }: PostfixEvaluationProps) {
  const { steps, isEvaluating, result, evaluate } = usePostfixEvaluation()

  const handleEvaluate = () => {
    if (!isEvaluating) {
      evaluate(expression)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
        <CardHeader>
          <CardTitle className="text-violet-700 dark:text-violet-300">
            Postfix Expression
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-violet-500/10 bg-white/60 p-4 dark:bg-white/[0.03]">
            {expression.map((token, i) => (
              <TokenDisplay
                key={i}
                token={token}
                highlighted={
                  steps.length > 0 &&
                  steps[steps.length - 1].currentPosition === i
                }
              />
            ))}
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || expression.length === 0}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)] transition hover:opacity-95 disabled:opacity-50"
          >
            Evaluate Expression
          </button>
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card className="rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
          <CardHeader>
            <CardTitle className="text-violet-700 dark:text-violet-300">
              Evaluation Steps
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                Stack Contents
              </div>

              <div className="relative h-[300px] overflow-hidden rounded-2xl border border-violet-500/15 bg-white/60 dark:bg-white/[0.03]">
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
                <div className="flex h-full flex-col justify-end p-4">
                  <AnimatePresence mode="popLayout">
                    {[...steps[steps.length - 1].stack].reverse().map((value, i) => (
                      <motion.div
                        key={`${value}-${i}`}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="border-b border-violet-500/10 p-3 first:border-t"
                      >
                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 font-mono text-sm font-medium text-emerald-700 backdrop-blur-sm dark:text-emerald-300">
                          {value}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-500/10 bg-violet-500/5 px-4 py-3 text-base font-medium text-muted-foreground">
              {steps[steps.length - 1].message}
            </div>
          </CardContent>
        </Card>
      )}

      {result !== null && (
        <Card className="rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
          <CardHeader>
            <CardTitle className="text-violet-700 dark:text-violet-300">
              Result
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="inline-flex rounded-2xl border border-violet-500/15 bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-mono text-2xl font-bold text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)]">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}