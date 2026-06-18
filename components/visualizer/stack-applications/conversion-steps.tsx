"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConversionStep, Token } from "./types"
import { motion, AnimatePresence } from "framer-motion"

interface ConversionStepsProps {
  steps: ConversionStep[]
  currentExpression: string
}

function TokenDisplay({
  token,
  highlighted = false,
}: {
  token: Token
  highlighted?: boolean
}) {
  const getColor = () => {
    switch (token.type) {
      case "operator":
        return highlighted
          ? "border-blue-400/30 bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.25)]"
          : "border-blue-400/20 bg-blue-500/10 text-blue-700 dark:text-blue-300"
      case "operand":
        return highlighted
          ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.22)]"
          : "border-emerald-400/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      case "parenthesis":
        return highlighted
          ? "border-amber-400/30 bg-amber-400/20 text-amber-700 dark:text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.22)]"
          : "border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-300"
      default:
        return "border-violet-500/15 bg-white/70 text-foreground dark:bg-white/[0.04]"
    }
  }

  return (
    <div
      className={`rounded-xl border px-3 py-2 font-mono text-sm font-medium backdrop-blur-sm transition-all ${getColor()}`}
    >
      {token.value}
    </div>
  )
}

export function ConversionSteps({
  steps,
  currentExpression,
}: ConversionStepsProps) {
  if (steps.length === 0) {
    return (
      <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-violet-700 dark:text-violet-300">
            Conversion Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Enter an expression to see the conversion steps
        </CardContent>
      </Card>
    )
  }

  const currentStep = steps[steps.length - 1]
  const currentToken = currentStep.state.currentToken
  const currentPosition = currentStep.state.currentPosition

  return (
    <Card className="rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <CardHeader>
        <CardTitle className="text-violet-700 dark:text-violet-300">
          Conversion Steps
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current expression */}
        <div>
          <div className="mb-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
            Current Expression
          </div>

          <div className="flex flex-wrap gap-2 rounded-2xl border border-violet-500/10 bg-white/60 p-4 font-mono text-lg dark:bg-white/[0.03]">
            {currentExpression.split("").map((char, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-1.5 transition-all ${
                  i === currentPosition
                    ? "bg-gradient-to-r from-violet-600 to-blue-500 font-bold text-white shadow-[0_8px_24px_rgba(139,92,246,0.25)]"
                    : "bg-muted/50"
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div>
          <div className="mb-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
            Stack Contents
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-2xl border border-violet-500/15 bg-white/60 dark:bg-white/[0.03]">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
            <div className="flex h-full flex-col justify-end p-4">
              <AnimatePresence mode="popLayout">
                {[...currentStep.state.stack].reverse().map((token, i) => (
                  <motion.div
                    key={`${token.value}-${i}`}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="border-b border-violet-500/10 p-3 first:border-t"
                  >
                    <TokenDisplay
                      token={token}
                      highlighted={currentToken?.value === token.value}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
            Output
          </div>

          <div className="flex min-h-[64px] flex-wrap gap-2 rounded-2xl border border-violet-500/10 bg-white/60 p-4 dark:bg-white/[0.03]">
            <AnimatePresence mode="popLayout">
              {currentStep.state.output.map((token, i) => (
                <motion.div
                  key={`${token.value}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <TokenDisplay token={token} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Current action */}
        <div className="rounded-2xl border border-violet-500/10 bg-violet-500/5 px-4 py-3 text-base font-medium text-muted-foreground">
          {currentStep.action}
        </div>
      </CardContent>
    </Card>
  )
}