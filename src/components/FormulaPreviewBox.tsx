import { BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

import { Separator } from "@/components/ui/separator"
import type { GeminiFormula } from "@/types/gemini"

const EMPTY_TEXT = "아직 인식된 수식이 없습니다." as const

export type FormulaPreviewBoxProps = {
  formulas: GeminiFormula[] | null
}

export function FormulaPreviewBox({ formulas }: FormulaPreviewBoxProps) {
  const items = formulas ?? []

  return (
    <div className="space-y-0">
      {items.length === 0 ? (
        <div className="p-4 text-sm text-muted-foreground">{EMPTY_TEXT}</div>
      ) : (
        items.map((f, idx) => (
          <div key={idx}>
            <div className="p-4">
              <div className="mb-1 text-xs text-muted-foreground">
                {f.isGraphable ? "그래프 가능" : "그래프 불가"}
                {f.type ? ` · ${f.type}` : ""}
              </div>
              <div className="overflow-x-auto">
                <BlockMath math={f.displayLatex || f.latex} />
              </div>
            </div>
            {idx < items.length - 1 ? <Separator /> : null}
          </div>
        ))
      )}
    </div>
  )
}

