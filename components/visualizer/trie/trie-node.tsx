"use client"

import { Handle, Position } from "reactflow"
import { motion } from "framer-motion"

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

interface TrieNodeData {
  char: string
  isEndOfWord: boolean
  highlighted: boolean
  matched: boolean
  isRoot: boolean
}

export default function TrieFlowNode({ data }: { data: TrieNodeData }) {
  const { char, isEndOfWord, highlighted, matched, isRoot } = data
  const active = highlighted || matched

  return (
    <>
      {!isRoot && <Handle type="target" position={Position.Top} />}

      <motion.div
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-full border font-semibold text-sm uppercase backdrop-blur-xl transition-all duration-300",
          active
            ? "border-violet-400 bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
            : isRoot
              ? "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300"
              : "border-violet-500/20 bg-white/70 text-foreground shadow-sm dark:bg-white/[0.06]"
        )}
        animate={{ scale: active ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {char}

        {isEndOfWord && (
          <span
            className="absolute -bottom-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-emerald-400 bg-emerald-500 text-[9px] font-bold text-white"
            title="End of word"
          >
            ●
          </span>
        )}
      </motion.div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}
