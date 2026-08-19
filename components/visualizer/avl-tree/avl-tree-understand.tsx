"use client"
// components/visualizer/avl-tree/avl-tree-understand.tsx

import { Scale, RotateCw, Sparkles } from "lucide-react"

function RotationCard({ label, trigger, fix }: { label: string; trigger: string; fix: string }) {
  return (
    <div className="rounded-2xl border border-violet-500/12 bg-white/60 p-4 dark:bg-white/[0.03]">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-violet-500">{label}</p>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Trigger: </span>{trigger}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Fix: </span>{fix}
      </p>
    </div>
  )
}

export function AVLTreeUnderstand() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-violet-500/15 bg-white/70 p-6 dark:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-500">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">A BST that refuses to get lopsided</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              A plain Binary Search Tree can degrade into a straight line — insert 1, 2, 3, 4, 5 in
              order and you get a stick, not a tree, with O(n) search instead of O(log n). An AVL
              tree is a BST that checks itself after every insert and{" "}
              <span className="font-semibold text-foreground">rotates nodes around</span> the moment
              it starts leaning too far to one side.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-500/15 bg-white/70 p-6 dark:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-500">
            <Scale className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Balance factor: the number that decides everything</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Every node tracks its own <span className="font-mono text-foreground">balance factor</span> —
              the height of its left subtree minus the height of its right subtree.
            </p>
            <div className="mt-3 rounded-xl border border-violet-500/15 bg-neutral-950 px-4 py-3 font-mono text-sm text-violet-300">
              balanceFactor(node) = height(node.left) − height(node.right)
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-center">
                <p className="font-mono text-sm font-bold text-emerald-500">-1, 0, +1</p>
                <p className="text-xs text-muted-foreground">Balanced — leave it alone</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-center">
                <p className="font-mono text-sm font-bold text-rose-500">&gt; +1</p>
                <p className="text-xs text-muted-foreground">Left-heavy — rotate right</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-center">
                <p className="font-mono text-sm font-bold text-rose-500">&lt; -1</p>
                <p className="text-xs text-muted-foreground">Right-heavy — rotate left</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              In the Visualization tab, every node shows its live balance factor as a small badge —
              green when balanced, red the instant it tips past ±1 (right before a rotation fixes it).
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-500/15 bg-white/70 p-6 dark:bg-white/[0.04]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-500">
            <RotateCw className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold">The four rotation cases</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RotationCard label="LL — Left Left" trigger="Balance factor > 1, and the new value went into the left subtree's left side." fix="One right rotation at the unbalanced node." />
          <RotationCard label="RR — Right Right" trigger="Balance factor < -1, and the new value went into the right subtree's right side." fix="One left rotation at the unbalanced node." />
          <RotationCard label="LR — Left Right" trigger="Balance factor > 1, but the new value went into the left subtree's right side." fix="Left rotation on the left child, then a right rotation at the node." />
          <RotationCard label="RL — Right Left" trigger="Balance factor < -1, but the new value went into the right subtree's left side." fix="Right rotation on the right child, then a left rotation at the node." />
        </div>
      </div>

      <div className="rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] to-blue-500/[0.06] p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-violet-500" />
          <div>
            <h3 className="text-sm font-semibold">Why bother?</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Because a plain BST&apos;s worst-case height is O(n) — an AVL tree guarantees O(log n)
              height, always, no matter what order you insert in. That&apos;s the whole trade: a little
              extra rebalancing work on every insert, in exchange for search, insert, and delete that
              never degrade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
