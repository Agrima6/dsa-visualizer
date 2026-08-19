"use client"

import { AVLTreeNode, RotationType } from "./types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function analyze(tree: AVLTreeNode | null) {
  let nodeCount = 0
  let maxBalanceFactor = 0

  function height(n: AVLTreeNode | null): number {
    return n ? n.height : 0
  }

  function walk(n: AVLTreeNode | null) {
    if (!n) return
    nodeCount++
    const bf = height(n.left) - height(n.right)
    if (Math.abs(bf) > Math.abs(maxBalanceFactor)) maxBalanceFactor = bf
    walk(n.left)
    walk(n.right)
  }

  walk(tree)

  const treeHeight = height(tree)
  const theoreticalMinHeight = nodeCount > 0 ? Math.ceil(Math.log2(nodeCount + 1)) : 0

  return { nodeCount, treeHeight, theoreticalMinHeight, maxBalanceFactor }
}

export function AVLTreeAnalysis({
  tree,
  rotationCount,
  rotationHistory,
}: {
  tree: AVLTreeNode | null
  rotationCount: number
  rotationHistory: { type: RotationType; atValue: number }[]
}) {
  if (!tree) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No tree data available. Insert some nodes to see the analysis.</AlertDescription>
      </Alert>
    )
  }

  const { nodeCount, treeHeight, theoreticalMinHeight, maxBalanceFactor } = analyze(tree)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Shape</CardTitle>
          <CardDescription>How tall did the tree actually get?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Total Nodes:</span>
            <span className="font-mono">{nodeCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Actual Height:</span>
            <span className="font-mono">{treeHeight}</span>
          </div>
          <div className="flex justify-between">
            <span>Theoretical Min Height:</span>
            <span className="font-mono">{theoreticalMinHeight}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
          <CardDescription>The AVL guarantee in action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Worst Balance Factor:</span>
            <span className="font-mono">{maxBalanceFactor}</span>
          </div>
          <div className="flex justify-between">
            <span>Height ≤ 1.44·log₂(n+2):</span>
            <span className="text-emerald-500">Always true</span>
          </div>
          <div className="flex justify-between">
            <span>Rotations This Session:</span>
            <span className="font-mono">{rotationCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rotation Log</CardTitle>
          <CardDescription>Every rebalance that has happened</CardDescription>
        </CardHeader>
        <CardContent>
          {rotationHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rotations yet — insert values that unbalance the tree to see one.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {rotationHistory.slice(-10).map((r, i) => (
                <span
                  key={i}
                  className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-mono text-violet-600 dark:text-violet-300"
                >
                  {r.type} @ {r.atValue}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
