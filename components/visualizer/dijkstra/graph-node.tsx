"use client"

import { Handle, Position } from "reactflow"
import { motion } from "framer-motion"

interface GraphNodeData {
  id: string
  distance: number
  isVisited: boolean
  isCurrent: boolean
  isPath: boolean
}

export default function GraphNode({ data }: { data: GraphNodeData }) {
  const nodeClass = data.isCurrent
    ? "bg-gradient-to-br from-violet-600 to-fuchsia-500 border-violet-300 text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
    : data.isPath
    ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-300 text-white shadow-[0_10px_30px_rgba(16,185,129,0.30)]"
    : data.isVisited
    ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-300 text-white shadow-[0_10px_24px_rgba(59,130,246,0.22)]"
    : "bg-white/80 dark:bg-white/[0.05] border-violet-500/15 text-foreground shadow-sm"

  const handleStyle = {
    background: "rgba(139,92,246,0.7)",
    width: 8,
    height: 8,
    border: "1px solid rgba(255,255,255,0.5)",
  }

  return (
    <>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Right} style={handleStyle} />
      <Handle type="target" position={Position.Bottom} style={handleStyle} />

      <motion.div
        className={`
          w-[72px] h-[72px] rounded-full
          flex flex-col items-center justify-center
          border-2 font-semibold backdrop-blur-md
          transition-all duration-300
          ${nodeClass}
        `}
        animate={{
          scale: data.isCurrent ? 1.12 : data.isPath ? 1.06 : 1,
          y: data.isCurrent ? -4 : 0,
          transition: { type: "spring", stiffness: 260, damping: 18 },
        }}
      >
        <span className="text-lg leading-none">{data.id}</span>
        <span className="mt-1 text-[11px] opacity-80">
          {data.distance === Infinity ? "∞" : data.distance}
        </span>
      </motion.div>

      <Handle type="source" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </>
  )
}