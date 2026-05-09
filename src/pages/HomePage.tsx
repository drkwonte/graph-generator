import * as React from "react"

import { ImageUploader } from "@/components/ImageUploader"
import { Button } from "@/components/ui/button"
import { useGeminiAnalysis } from "@/hooks/useGeminiAnalysis"
import { PanelCard } from "@/components/PanelCard"
import { PanelBody } from "@/components/PanelBody"
import { FormulaSelectionList } from "@/components/FormulaSelectionList"
import { LoadingIndicator } from "@/components/LoadingIndicator"
import { GraphRenderer } from "@/components/GraphRenderer"
import { GraphLegend } from "@/components/GraphLegend"
import type { GeminiFormula } from "@/types/gemini"
import { normalizeFunctionNotation } from "@/lib/normalizeFunctionNotation"
import { GRAPH_VIEW_WIDTH_PERCENT } from "@/constants/ui"
import { useGraphExport } from "@/hooks/useGraphExport"
import { useGraphPrint } from "@/hooks/useGraphPrint"
import { GRAPH_COLORS, PRINT_GRAPH_BUTTON_TEXT } from "@/constants/graph"
import { PRINT_MARK_EXPORT, PRINT_MARK_GRAPH_WRAP } from "@/constants/printDom"
import { DEFAULT_DOCUMENT_TITLE, DEFAULT_META_DESCRIPTION } from "@/constants/seo"
import { useDocumentSEO } from "@/hooks/useDocumentSEO"

const CONVERT_BUTTON_TEXT = "선택한 수식 그래프로 변환" as const
const GRAPH_PANEL_TITLE = "그래프" as const

export function HomePage() {
  useDocumentSEO(DEFAULT_DOCUMENT_TITLE, DEFAULT_META_DESCRIPTION)

  const { analyzeImage, data, errorMessage, status, reset } = useGeminiAnalysis()
  const [imageBlob, setImageBlob] = React.useState<Blob | null>(null)
  const [selectedFormulaIndices, setSelectedFormulaIndices] = React.useState<
    number[]
  >([])
  const [graphFormulas, setGraphFormulas] = React.useState<GeminiFormula[] | null>(null)
  const isAnalyzing = status === "loading"
  const hasResult = status === "success" && !!data
  const exportAreaRef = React.useRef<HTMLDivElement | null>(null)
  const graphSvgContainerRef = React.useRef<HTMLDivElement | null>(null)
  const { downloadPng, errorMessage: exportError } = useGraphExport(exportAreaRef)
  const { printGraph, errorMessage: printError } = useGraphPrint(exportAreaRef)

  React.useEffect(() => {
    if (!data?.formulas?.length) {
      setSelectedFormulaIndices([])
      return
    }
    setSelectedFormulaIndices(data.formulas.map((_, idx) => idx))
  }, [data])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-balance text-2xl font-normal tracking-tight">
          수식 이미지를 올리면 그래프로 변환합니다
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ImageUploader
            onReady={({ compressedBlob }) => {
              setImageBlob(compressedBlob)
              reset()
              setSelectedFormulaIndices([])
              setGraphFormulas(null)
            }}
          />
        </div>

        <div className="space-y-3">
          <PanelCard
            title="수식"
            action={
              <Button
                type="button"
                variant={hasResult ? "outline" : "default"}
                disabled={!imageBlob || isAnalyzing}
                onClick={() => {
                  if (!imageBlob) return
                  void analyzeImage(imageBlob)
                }}
              >
                {isAnalyzing
                  ? "분석 중…"
                  : hasResult
                    ? "🔄 다시 인식하기"
                    : "AI로 수식 인식하기"}
              </Button>
            }
          >
            <PanelBody
              main={
                isAnalyzing ? (
                  <LoadingIndicator />
                ) : errorMessage ? (
                  <div className="grid h-full place-items-center p-6 text-sm text-destructive">
                    <div className="max-w-md text-center">{errorMessage}</div>
                  </div>
                ) : data?.formulas?.length ? (
                  <div className="h-full overflow-auto">
                    <FormulaSelectionList
                      formulas={data.formulas}
                      selectedIndices={selectedFormulaIndices}
                      onChangeSelectedIndices={setSelectedFormulaIndices}
                    />
                  </div>
                ) : (
                  <div className="grid h-full place-items-center p-6 text-sm text-muted-foreground">
                    <div className="text-center">아직 인식된 수식이 없습니다.</div>
                  </div>
                )
              }
            />
          </PanelCard>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="default"
          disabled={!data?.formulas?.length || selectedFormulaIndices.length === 0}
          onClick={() => {
            if (!data?.formulas?.length) return
            const selected = selectedFormulaIndices
              .map((idx) => data.formulas[idx])
              .filter(Boolean)
            setGraphFormulas(selected)
          }}
        >
          {CONVERT_BUTTON_TEXT}
        </Button>
      </div>

      <PanelCard title={GRAPH_PANEL_TITLE}>
        <PanelBody
          fixedHeightPx={null}
          frame="none"
          main={
            graphFormulas?.length ? (
              <div className="space-y-3">
                <div
                  ref={exportAreaRef}
                  className="space-y-3"
                  data-print={PRINT_MARK_EXPORT}
                >
                  <div
                    className="mx-auto"
                    data-print={PRINT_MARK_GRAPH_WRAP}
                    style={{ width: `${GRAPH_VIEW_WIDTH_PERCENT}%` }}
                  >
                    <GraphRenderer
                      containerRef={graphSvgContainerRef}
                      functions={graphFormulas
                        .filter((f) => f.isGraphable)
                        .map((f, idx) => ({
                          fn: normalizeFunctionNotation(f.functionNotation),
                          color: GRAPH_COLORS[idx % GRAPH_COLORS.length],
                        }))}
                    />
                  </div>

                  <div className="w-full px-2 pb-1">
                    <GraphLegend
                      items={graphFormulas
                        .filter((f) => f.isGraphable)
                        .map((f, idx) => ({
                          color: GRAPH_COLORS[idx % GRAPH_COLORS.length],
                          latex: f.displayLatex || f.latex || f.functionNotation,
                        }))}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid h-full place-items-center p-6 text-sm text-muted-foreground">
                <div className="text-center">선택한 수식을 그래프로 변환하면 여기에 표시됩니다.</div>
              </div>
            )
          }
        />
      </PanelCard>

      {graphFormulas?.length ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {exportError ? <div className="text-sm text-destructive">{exportError}</div> : null}
          {printError ? <div className="text-sm text-destructive">{printError}</div> : null}
          <Button type="button" variant="outline" onClick={() => void downloadPng()}>
            PNG 다운로드
          </Button>
          <Button type="button" variant="outline" onClick={() => printGraph()}>
            {PRINT_GRAPH_BUTTON_TEXT}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
