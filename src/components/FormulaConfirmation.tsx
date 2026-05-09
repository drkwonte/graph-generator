import { BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import type { GeminiFormula } from "@/types/gemini"

const TITLE = "인식된 수식을 확인해 주세요" as const
const SUBTITLE =
  "이미지 안의 그래프로 표현 가능한 수식을 모두 보여드립니다. 그래프로 그릴 수식을 선택해 주세요." as const

const HANDWRITING_WARNING_TEXT =
  "손글씨로 감지되어 인식 결과가 부정확할 수 있습니다." as const

type FormulaConfirmationProps = {
  formulas: GeminiFormula[]
  confidence: number
  warning: string | null
  selectedIndices: number[]
  onChangeSelectedIndices: (next: number[]) => void
  onRetry: () => void
  onConfirm: () => void
}

function toggleIndex(selected: number[], idx: number) {
  return selected.includes(idx)
    ? selected.filter((v) => v !== idx)
    : [...selected, idx]
}

export function FormulaConfirmation({
  formulas,
  confidence,
  warning,
  selectedIndices,
  onChangeSelectedIndices,
  onRetry,
  onConfirm,
}: FormulaConfirmationProps) {
  const graphableCount = formulas.filter((f) => f.isGraphable).length
  const selectedCount = selectedIndices.length

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{TITLE}</h2>
        <p className="text-sm text-muted-foreground">{SUBTITLE}</p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>confidence: {confidence.toFixed(2)}</span>
          <span>graphable: {graphableCount}</span>
          <span>selected: {selectedCount}</span>
        </div>
        {warning === "handwriting_detected" ? (
          <div className="text-destructive">{HANDWRITING_WARNING_TEXT}</div>
        ) : null}
      </div>

      <Card className="p-0">
        <CardContent className="px-0">
          {formulas.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              그래프로 표현 가능한 수식을 찾지 못했습니다.
            </div>
          ) : (
            formulas.map((f, idx) => (
              <div key={idx}>
                <label className="flex cursor-pointer items-start gap-3 p-4">
                  <Checkbox
                    checked={selectedIndices.includes(idx)}
                    disabled={!f.isGraphable}
                    onCheckedChange={() =>
                      onChangeSelectedIndices(toggleIndex(selectedIndices, idx))
                    }
                    aria-label={`Select formula ${idx + 1}`}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {f.isGraphable ? "그래프 가능" : "그래프 불가"}
                      {f.type ? ` · ${f.type}` : ""}
                    </div>
                    <div className="overflow-x-auto">
                      <BlockMath math={f.displayLatex || f.latex} />
                    </div>
                    {!f.isGraphable ? (
                      <div className="text-xs text-muted-foreground">
                        이 수식은 \(x\)-\(y\) 평면 함수로 해석하기 어려워 제외됩니다.
                      </div>
                    ) : null}
                  </div>
                </label>
                {idx < formulas.length - 1 ? <Separator /> : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onRetry}>
          🔄 다시 인식하기
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={selectedIndices.length === 0}
          onClick={onConfirm}
        >
          📈 그래프 그리기
        </Button>
      </div>
    </section>
  )
}

