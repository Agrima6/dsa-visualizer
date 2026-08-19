"use client"

import { Handle, Position } from "reactflow"
import { motion } from "framer-motion"

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function AVLTreeNode({
  data,
}: {
  data: { id: string; value: number; balanceFactor: number; highlighted: boolean; rotating: boolean }
}) {
  const { value, balanceFactor, highlighted, rotating } = data
  const isUnbalanced = Math.abs(balanceFactor) > 1

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <motion.div
        className={cn(
          "relative flex h-[54px] w-[54px] items-center justify-center rounded-full border font-semibold text-sm backdrop-blur-xl transition-all duration-300",
          rotating
            ? "border-amber-400 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.45)]"
            : highlighted
            ? "border-violet-400 bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
            : "border-violet-500/20 bg-white/70 text-foreground shadow-sm dark:bg-white/[0.06]"
        )}
        animate={{ scale: highlighted || rotating ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {value}

        {/* Balance factor badge */}
        <span
          className={cn(
            "absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold",
            isUnbalanced
              ? "border-rose-400 bg-rose-500 text-white"
              : "border-emerald-400/60 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          )}
          title={`Balance factor: ${balanceFactor}`}
        >
          {balanceFactor > 0 ? `+${balanceFactor}` : balanceFactor}
        </span>
      </motion.div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}
