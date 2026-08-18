// components/visualizer/sorting/sorting-bug-registry.ts
import { SORTING_BUG_CORE } from "./sorting-bug-data-core"
import { SORTING_BUG_MORE } from "./sorting-bug-data-more"
import type { SortingBugVariant } from "./sorting-bug-types"

export type { SortingBugVariant } from "./sorting-bug-types"
export { findDivergenceIndex } from "./sorting-bug-types"

const ALL_VARIANTS: SortingBugVariant[] = [...SORTING_BUG_CORE, ...SORTING_BUG_MORE]

export const SORTING_BUG_BY_SLUG: Record<string, SortingBugVariant> = Object.fromEntries(
  ALL_VARIANTS.map((v) => [v.problemSlug, v])
)
