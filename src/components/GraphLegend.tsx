import { InlineMath } from "react-katex"

import { PRINT_MARK_LEGEND } from "@/constants/printDom"

export type GraphLegendItem = {
  color: string
  latex: string
}

export type GraphLegendProps = {
  items: GraphLegendItem[]
}

export function GraphLegend({ items }: GraphLegendProps) {
  if (items.length === 0) return null

  return (
    <div
      data-print={PRINT_MARK_LEGEND}
      className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
    >
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span
            className="inline-block size-3 rounded-sm"
            style={{ backgroundColor: it.color }}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">
            <InlineMath math={it.latex} />
          </span>
        </div>
      ))}
    </div>
  )
}

