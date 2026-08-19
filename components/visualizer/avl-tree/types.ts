export interface AVLTreeNode {
  id: string
  value: number
  left: AVLTreeNode | null
  right: AVLTreeNode | null
  height: number
}

export type RotationType = "LL" | "RR" | "LR" | "RL"
