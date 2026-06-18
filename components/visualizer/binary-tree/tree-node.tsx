"use client"

import { Handle, Position } from "reactflow"
import { motion } from "framer-motion"

export default function TreeNode({
  data,
}: {
  data: { id: string; value: number; highlighted: boolean }
}) {
  return (
    <>
      <Handle type="target" position={Position.Top} />

      <motion.div
        className={`
          w-[54px] h-[54px] 
          rounded-full flex items-center justify-center 
          font-semibold text-sm
          backdrop-blur-xl border
          transition-all duration-300

          ${
            data.highlighted
              ? "bg-gradient-to-br from-violet-600 to-blue-500 text-white border-violet-400 shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
              : "bg-white/70 dark:bg-white/[0.06] text-foreground border-violet-500/20 shadow-sm"
          }
        `}
        animate={{
          scale: data.highlighted ? 1.15 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
        }}
      >
        {data.value}
      </motion.div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}