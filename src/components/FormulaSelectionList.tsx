import { BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import type { GeminiFormula } from "@/types/gemini"

const EMPTY_TEXT = "아직 인식된 수식이 없습니다." as const

export type FormulaSelectionListProps = {
  formulas: GeminiFormula[] | null
  selectedIndices: number[]
  onChangeSelectedIndices: (next: number[]) => void
}

function toggleIndex(selected: number[], idx: number) {
  return selected.includes(idx)
    ? selected.filter((v) => v !== idx)
    : [...selected, idx]
}

export function FormulaSelectionList({
  formulas,
  selectedIndices,
  onChangeSelectedIndices,
}: FormulaSelectionListProps) {
  const items = formulas ?? []

  if (items.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">{EMPTY_TEXT}</div>
  }

  return (
    <div className="space-y-0">
      {items.map((f, idx) => {
        const isSelected = selectedIndices.includes(idx)
        return (
          <div key={idx}>
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-xs text-muted-foreground">
                  {f.isGraphable ? "그래프 가능" : "그래프 불가"}
                  {f.type ? ` · ${f.type}` : ""}
                </div>
                <div className="overflow-x-auto">
                  <BlockMath math={f.displayLatex || f.latex} />
                </div>
              </div>

              <Checkbox
                checked={isSelected}
                onCheckedChange={() =>
                  onChangeSelectedIndices(toggleIndex(selectedIndices, idx))
                }
                aria-label={`Select formula ${idx + 1}`}
                className="mt-2"
              />
            </div>
            {idx < items.length - 1 ? <Separator /> : null}
          </div>
        )
      })}
    </div>
  )
}

