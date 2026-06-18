"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { usePolynomial, PolynomialNode, Term } from "@/hooks/use-polynomial"
import { LinkedListDisplay } from "../linked-list/linked-list-display"
import { ListNode, LinkedList } from "../linked-list/types"
import { AnimatePresence, motion } from "framer-motion"
import { useStepFeedback } from "@/hooks/use-step-feedback"

// ── Input limits ──────────────────────────────────────────────────────────────
const MAX_POLY_LENGTH = 20

// ── Only these characters are valid in a polynomial expression ────────────────
// digits, letters (coefficients/variables), spaces, operators, ^, dot
const VALID_POLY_REGEX = /^[0-9a-zA-Z\s+\-*/^.]*$/

interface ExtendedListNode extends ListNode {
  term?: Term
}

function adaptPolynomialToLinkedList(
  head: string | null,
  nodes: Map<string, PolynomialNode>
): LinkedList {
  const adaptedNodes = new Map<string, ExtendedListNode>()

  nodes.forEach((node, id) => {
    adaptedNodes.set(id, {
      id,
      value: id,
      next: node.next,
      prev: null,
      term: node.term,
    })
  })

  return {
    head,
    tail: null,
    nodes: adaptedNodes,
    type: "SLL",
  }
}

export function PolynomialMultiplication() {
  const [poly1Input, setPoly1Input] = useState("")
  const [poly2Input, setPoly2Input] = useState("")

  // Track invalid-char warnings per field
  const [invalidChar1, setInvalidChar1] = useState<string | null>(null)
  const [invalidChar2, setInvalidChar2] = useState<string | null>(null)

  const {
    poly1,
    poly2,
    result,
    steps,
    currentStep,
    highlightedNodes,
    createPolynomial,
    loadExample,
    parsePolynomial,
    multiply,
    setCurrentStep,
    setPoly1,
    setPoly2,
  } = usePolynomial()

  useStepFeedback(currentStep, steps.length, "Polynomial Multiplication")

  // ── Input handlers ────────────────────────────────────────────────────────

  const makeChangeHandler = (
    setter: (v: string) => void,
    flashInvalid: (ch: string | null) => void,
    timer: { current: ReturnType<typeof setTimeout> | null }
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      // Find first invalid character
      const badChar = raw.split("").find((ch) => !VALID_POLY_REGEX.test(ch))
      if (badChar !== undefined) {
        const label = badChar === " " ? "space" : `"${badChar}"`
        flashInvalid(label)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => flashInvalid(null), 2000)

        // Strip invalid chars and apply (up to MAX_POLY_LENGTH)
        const cleaned = raw
          .split("")
          .filter((ch) => VALID_POLY_REGEX.test(ch))
          .join("")
          .slice(0, MAX_POLY_LENGTH)
        setter(cleaned)
        return
      }

      // Valid — enforce length (no state update at limit = no glow)
      if (raw.length <= MAX_POLY_LENGTH) {
        setter(raw)
      }
    }
  }

  // Separate timer refs per field so they don't interfere
  const timer1 = { current: null as ReturnType<typeof setTimeout> | null }
  const timer2 = { current: null as ReturnType<typeof setTimeout> | null }

  const handlePoly1Change = makeChangeHandler(setPoly1Input, setInvalidChar1, timer1)
  const handlePoly2Change = makeChangeHandler(setPoly2Input, setInvalidChar2, timer2)

  // ── Other handlers ────────────────────────────────────────────────────────

  const handleCustomInput = () => {
    try {
      const terms1 = parsePolynomial(poly1Input)
      const terms2 = parsePolynomial(poly2Input)
      setPoly1(createPolynomial(terms1))
      setPoly2(createPolynomial(terms2))
    } catch {
      console.error("Invalid input format")
    }
  }

  const formatPolynomialNode = (
    nodeId: string,
    nodes: Map<string, ExtendedListNode>
  ) => {
    const node = nodes.get(nodeId)
    if (node?.term) {
      const { term } = node
      if (term.exponent === 0) return term.coefficient.toString()
      const coef =
        term.coefficient === 1
          ? ""
          : term.coefficient === -1
          ? "-"
          : term.coefficient.toString()
      const exp = term.exponent === 1 ? "x" : `x<sup>${term.exponent}</sup>`
      return <span dangerouslySetInnerHTML={{ __html: `${coef}${exp}` }} />
    }
    return nodeId.toString()
  }

  const nodeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit:    { scale: 0.8, opacity: 0 },
  }

  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (isAutoPlaying && currentStep < steps.length - 1) {
      timeoutId = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1500)
    } else if (currentStep >= steps.length - 1) {
      setIsAutoPlaying(false)
    }
    return () => clearTimeout(timeoutId)
  }, [isAutoPlaying, currentStep, steps.length, setCurrentStep])

  // ── Derived state for UI ──────────────────────────────────────────────────
  const isAtLimit1 = poly1Input.length >= MAX_POLY_LENGTH
  const isAtLimit2 = poly2Input.length >= MAX_POLY_LENGTH

  // ── Reusable input block ──────────────────────────────────────────────────
  const PolyInputField = ({
    label,
    value,
    placeholder,
    onChange,
    isAtLimit,
    invalidChar,
  }: {
    label: string
    value: string
    placeholder: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isAtLimit: boolean
    invalidChar: string | null
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm">{label}</label>

      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={MAX_POLY_LENGTH}
        className="rounded-xl border-violet-500/20 focus-visible:ring-violet-500"
      />

      {/* Counter + warnings row */}
      {value.length > 0 && (
        <div className="flex items-center justify-between">
          {/* Left: warning messages */}
          <span className="text-xs">
            {invalidChar ? (
              <span className="text-amber-600 dark:text-amber-400">
                {invalidChar === "space" ? "Spaces are" : (
                  <><span className="font-mono font-semibold">{invalidChar}</span> is</>
                )}{" "}
                not allowed
              </span>
            ) : isAtLimit ? (
              <span className="text-rose-500">
                Max {MAX_POLY_LENGTH} characters reached
              </span>
            ) : (
              <span className="text-muted-foreground">
                Allowed: <span className="font-mono">0-9 x + - ^ . space</span>
              </span>
            )}
          </span>

          {/* Right: character counter */}
          <span
            className={`text-xs tabular-nums ${
              isAtLimit
                ? "text-rose-500 font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {value.length}/{MAX_POLY_LENGTH}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[320px_1fr]">
      <div className="space-y-6">

        {/* ── Controls card ── */}
        <Card className="rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-5 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)]">
          <div className="mb-5">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Polynomial Controls
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter two polynomials and visualize multiplication step by step
            </p>
          </div>

          <div className="space-y-4">
            <PolyInputField
              label="First Polynomial"
              value={poly1Input}
              placeholder="e.g. 2x^2 + 3x + 1"
              onChange={handlePoly1Change}
              isAtLimit={isAtLimit1}
              invalidChar={invalidChar1}
            />

            <PolyInputField
              label="Second Polynomial"
              value={poly2Input}
              placeholder="e.g. x + 2"
              onChange={handlePoly2Change}
              isAtLimit={isAtLimit2}
              invalidChar={invalidChar2}
            />

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleCustomInput}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)]"
              >
                Set Polynomials
              </Button>

              <Button
                variant="outline"
                onClick={loadExample}
                className="rounded-xl border-violet-500/20 hover:bg-violet-500/5"
              >
                Use Example
              </Button>
              <Button
            onClick={multiply}
            disabled={!poly1.head || !poly2.head || steps.length > 0}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)]"
          >
            Start Multiplication
          </Button>
            </div>
          </div>
        </Card>

        {/* ── Operation history card ── */}
        <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="mb-5">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Operation History
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Follow each multiplication step and intermediate action
            </p>
          </div>
          

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {steps.length === 0 ? (
              <div className="rounded-2xl border border-violet-500/10 bg-white/70 px-4 py-4 text-sm text-muted-foreground dark:bg-white/[0.03]">
                No steps yet. Set polynomials and start multiplication.
              </div>
            ) : (
              steps.map((step, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border px-3 py-3 text-sm transition-all ${
                    index === currentStep
                      ? "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                      : "border-violet-500/10 bg-white/70 dark:bg-white/[0.03]"
                  }`}
                >
                  {step.message}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* ── Right panel ── */}
      <div className="space-y-6">
        <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="mb-5">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              First Polynomial
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Linked-list representation of the first polynomial
            </p>
          </div>

          <LinkedListDisplay
            list={adaptPolynomialToLinkedList(poly1.head, poly1.nodes)}
            highlightedNodes={highlightedNodes.poly1}
            message=""
            format={(nodeId) =>
              formatPolynomialNode(
                nodeId,
                adaptPolynomialToLinkedList(poly1.head, poly1.nodes).nodes
              )
            }
          />
        </Card>

        <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="mb-5">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Second Polynomial
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Linked-list representation of the second polynomial
            </p>
          </div>

          <LinkedListDisplay
            list={adaptPolynomialToLinkedList(poly2.head, poly2.nodes)}
            highlightedNodes={highlightedNodes.poly2}
            message=""
            format={(nodeId) =>
              formatPolynomialNode(
                nodeId,
                adaptPolynomialToLinkedList(poly2.head, poly2.nodes).nodes
              )
            }
          />
        </Card>

        {result.head && (
          <Card className="rounded-[28px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <div className="mb-5">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Result Polynomial
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Watch the resulting polynomial evolve as terms combine
              </p>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={nodeVariants}
              >
                <LinkedListDisplay
                  list={adaptPolynomialToLinkedList(result.head, result.nodes)}
                  highlightedNodes={highlightedNodes.result}
                  message=""
                  format={(nodeId) =>
                    formatPolynomialNode(
                      nodeId,
                      adaptPolynomialToLinkedList(result.head, result.nodes).nodes
                    )
                  }
                />
              </motion.div>
            </AnimatePresence>
          </Card>
        )}

        {/* ── Step controls ── */}
        <div className="flex flex-wrap gap-3">
          
          {steps.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep <= 0}
                className="rounded-xl border-violet-500/20 hover:bg-violet-500/5"
              >
                Previous Step
              </Button>

              <Button
                onClick={() =>
                  setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
                }
                disabled={currentStep >= steps.length - 1}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white"
              >
                Next Step
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="rounded-xl border-violet-500/20 hover:bg-violet-500/5"
          >
            {isAutoPlaying ? "Pause" : "Auto Play"}
          </Button>
        </div>
      </div>
    </div>
  )
}