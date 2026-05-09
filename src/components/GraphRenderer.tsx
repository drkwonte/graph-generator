import * as React from "react"

import { GRAPH_COLORS, GRAPH_DEFAULT_HEIGHT_PX } from "@/constants/graph"
import { PRINT_MARK_GRAPH_HOST } from "@/constants/printDom"
import { cn } from "@/lib/utils"

const SVG_NAMESPACE = "http://www.w3.org/2000/svg" as const
const LIGHT_BACKGROUND = "#ffffff" as const
const LIGHT_TEXT = "#111827" as const
const LIGHT_GRID = "#e5e7eb" as const

function injectLightSvgStyle(svg: SVGSVGElement) {
  svg
    .querySelectorAll("style[data-snapgraph-style='light']")
    .forEach((n) => n.remove())

  const style = document.createElementNS(SVG_NAMESPACE, "style")
  style.setAttribute("data-snapgraph-style", "light")
  style.textContent = `
    text { fill: ${LIGHT_TEXT}; }
    .axis path, .axis line, .domain { stroke: ${LIGHT_TEXT}; }
    .tick line { stroke: ${LIGHT_GRID}; }
  `

  const width = svg.viewBox.baseVal?.width || svg.clientWidth || 800
  const height = svg.viewBox.baseVal?.height || svg.clientHeight || 800

  const existingBg = svg.querySelector("rect[data-snapgraph-bg='light']")
  if (!existingBg) {
    const bg = document.createElementNS(SVG_NAMESPACE, "rect")
    bg.setAttribute("data-snapgraph-bg", "light")
    bg.setAttribute("x", "0")
    bg.setAttribute("y", "0")
    bg.setAttribute("width", String(width))
    bg.setAttribute("height", String(height))
    bg.setAttribute("fill", LIGHT_BACKGROUND)
    svg.insertBefore(bg, svg.firstChild)
  }

  svg.insertBefore(style, svg.firstChild)
}

export type GraphFunction = {
  fn: string
  color?: string
  fnType?: "linear" | "implicit" | "points"
  /** Required when `fnType` is `"points"` (two or more `[x, y]` samples in math space). */
  points?: [number, number][]
  skipBoundsCheck?: boolean
}

export type GraphRendererProps = {
  functions: GraphFunction[]
  className?: string
  heightPx?: number
  isSquare?: boolean
  containerRef?: React.RefObject<HTMLDivElement | null>
}

function clearElement(el: HTMLElement) {
  while (el.firstChild) el.removeChild(el.firstChild)
}

async function loadFunctionPlot() {
  const mod = (await import("function-plot")) as unknown

  const maybeModules: unknown[] = [mod]
  if (mod && typeof mod === "object") {
    const modRec = mod as Record<string, unknown>
    maybeModules.push(modRec.default)
    const def = modRec.default
    if (def && typeof def === "object") {
      maybeModules.push((def as Record<string, unknown>).default)
    }
  }

  const functionPlot = maybeModules.find((c): c is (options: FunctionPlotOptions) => unknown =>
    typeof c === "function",
  )
  if (typeof functionPlot !== "function") {
    throw new Error("function-plot import failed: expected a function export.")
  }
  return functionPlot
}

type FunctionPlotDatum = {
  fn: string
  color?: string
  graphType?: "polyline"
  fnType?: "linear" | "implicit" | "points"
  points?: [number, number][]
  skipBoundsCheck?: boolean
}

type FunctionPlotOptions = {
  target: HTMLElement
  width: number
  height: number
  grid: boolean
  data: FunctionPlotDatum[]
}

export function GraphRenderer({
  functions,
  className,
  heightPx,
  isSquare = true,
  containerRef: externalRef,
}: GraphRendererProps) {
  const internalRef = React.useRef<HTMLDivElement | null>(null)
  const containerRef = externalRef ?? internalRef
  const [width, setWidth] = React.useState<number>(0)
  const [height, setHeight] = React.useState<number>(0)
  const [renderError, setRenderError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const nextWidth = Math.floor(entry.contentRect.width)
      const nextHeight = Math.floor(entry.contentRect.height)
      setWidth(nextWidth)
      setHeight(nextHeight)
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (width <= 0) return
    if (isSquare && height <= 0) return

    clearElement(el)

    if (functions.length === 0) return

    let cancelled = false
    void (async () => {
      try {
        const functionPlot = await loadFunctionPlot()
        if (cancelled) return

        const computedHeightPx = isSquare
          ? height || width
          : (heightPx ?? GRAPH_DEFAULT_HEIGHT_PX)

        functionPlot({
          target: el,
          width,
          height: computedHeightPx,
          grid: true,
          data: functions.map((f, idx) => {
            const datum: FunctionPlotDatum = {
              fn: f.fn,
              color: f.color ?? GRAPH_COLORS[idx % GRAPH_COLORS.length],
              graphType: "polyline",
              fnType: f.fnType ?? "linear",
            }
            if (f.fnType === "points" && f.points?.length) {
              datum.points = f.points
              datum.skipBoundsCheck = f.skipBoundsCheck ?? true
            }
            return datum
          }),
        })

        const svg = el.querySelector("svg")
        if (svg instanceof SVGSVGElement) {
          injectLightSvgStyle(svg)
        }

        // Clear any previous error only after a successful render.
        setRenderError(null)
      } catch (error) {
        if (cancelled) return
        const message =
          error instanceof Error ? error.message : "그래프 렌더링에 실패했습니다."
        setRenderError(message)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [containerRef, functions, height, heightPx, isSquare, width])

  return (
    <div
      ref={containerRef}
      data-print={PRINT_MARK_GRAPH_HOST}
      className={cn(
        // Force light-mode rendering for the graph regardless of app theme
        "w-full overflow-hidden rounded-lg border bg-white text-black",
        className,
      )}
      style={isSquare ? { aspectRatio: "1 / 1" } : undefined}
    >
      {renderError ? (
        <div className="grid h-full place-items-center p-6 text-sm text-destructive">
          <div className="max-w-md text-center">{renderError}</div>
        </div>
      ) : null}
    </div>
  )
}

