"use client"

import { Handle, Position } from "reactflow"
import { motion } from "framer-motion"

interface HuffmanTreeNodeData {
  value: string
  frequency: number
  code?: string
  highlighted: boolean
}

export default function TreeNode({ data }: { data: HuffmanTreeNodeData }) {
  const isLeaf = data.code !== undefined

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <motion.div
        className={`
          min-w-[90px] px-3 py-2
          rounded-2xl flex flex-col items-center justify-center 
          border text-sm font-semibold
          backdrop-blur-md transition-all duration-300

          ${
            data.highlighted
              ? "bg-gradient-to-br from-violet-600 to-blue-500 text-white border-violet-300 shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
              : "bg-white/80 dark:bg-white/[0.05] text-foreground border-violet-500/15 shadow-sm"
          }
        `}
        animate={{
          scale: data.highlighted ? 1.12 : 1,
          y: data.highlighted ? -4 : 0,
          transition: { type: "spring", stiffness: 260, damping: 18 },
        }}
      >
        {/* Value */}
        <span className="font-mono text-[14px]">
          {isLeaf ? `'${data.value}'` : data.value}
        </span>

        {/* Frequency */}
        <span className="text-[11px] opacity-70 mt-[2px]">
          f = {data.frequency}
        </span>

        {/* Code */}
        {data.code && (
          <span className="text-[11px] mt-1 font-bold tracking-wide text-violet-200">
            {data.code}
          </span>
        )}
      </motion.div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}