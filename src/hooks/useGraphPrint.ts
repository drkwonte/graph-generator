import * as React from "react"

import {
  PRINT_MARK_EXPORT,
  PRINT_MARK_GRAPH_HOST,
  PRINT_MARK_GRAPH_WRAP,
  PRINT_MARK_LEGEND,
} from "@/constants/printDom"

const PRINT_DOCUMENT_TITLE = "SnapGraph" as const
const PRINT_ROOT_ELEMENT_ID = "snapgraph-print-root" as const
const PRINT_READY_DELAY_MS = 450 as const
const PRINT_IFRAME_CLEANUP_FALLBACK_MS = 120_000 as const

const PRINT_LAYOUT_STYLES = `
@page {
  size: A4 portrait;
  margin: 8mm;
}
html, body {
  margin: 0;
  padding: 0;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
#${PRINT_ROOT_ELEMENT_ID} {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  page-break-inside: avoid;
  break-inside: avoid;
}
[data-print="${PRINT_MARK_EXPORT}"] {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
[data-print="${PRINT_MARK_GRAPH_WRAP}"] {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
  box-sizing: border-box !important;
}
[data-print="${PRINT_MARK_GRAPH_HOST}"] {
  width: 100% !important;
  max-width: 100% !important;
  aspect-ratio: unset !important;
  overflow: visible !important;
  box-sizing: border-box !important;
}
[data-print="${PRINT_MARK_GRAPH_HOST}"] svg {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
}
[data-print="${PRINT_MARK_LEGEND}"] {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  row-gap: 6px !important;
  column-gap: 10px !important;
}
` as const

function collectStylesheetMarkup(): string {
  const parts: string[] = []
  document.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
    if (node instanceof HTMLLinkElement && node.href) {
      parts.push(node.outerHTML)
    }
  })
  document.querySelectorAll("style").forEach((node) => {
    parts.push(node.outerHTML)
  })
  return parts.join("\n")
}

/**
 * Prints graph + legend without `window.open` (avoids blank-tab / noopener issues).
 * Uses a short-lived hidden iframe in the same document.
 */
export function useGraphPrint(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const printGraph = React.useCallback(() => {
    setErrorMessage(null)
    const container = containerRef.current
    if (!container) {
      setErrorMessage("그래프가 아직 준비되지 않았습니다.")
      return
    }

    const iframe = document.createElement("iframe")
    iframe.setAttribute("aria-hidden", "true")
    iframe.setAttribute("title", PRINT_DOCUMENT_TITLE)
    iframe.style.position = "fixed"
    iframe.style.right = "0"
    iframe.style.bottom = "0"
    iframe.style.width = "0"
    iframe.style.height = "0"
    iframe.style.border = "0"
    iframe.style.margin = "0"
    iframe.style.padding = "0"
    iframe.style.opacity = "0"
    iframe.style.pointerEvents = "none"
    document.body.appendChild(iframe)

    const doc = iframe.contentDocument
    const win = iframe.contentWindow
    if (!doc || !win) {
      iframe.remove()
      setErrorMessage("인쇄용 영역을 만들 수 없습니다.")
      return
    }

    const markup = container.outerHTML
    const styles = collectStylesheetMarkup()

    doc.open()
    doc.write("<!DOCTYPE html><html><head>")
    doc.write(`<meta charset="utf-8"/><title>${PRINT_DOCUMENT_TITLE}</title>`)
    doc.write(styles)
    doc.write(`<style>${PRINT_LAYOUT_STYLES}</style>`)
    doc.write("</head><body>")
    doc.write(`<div id="${PRINT_ROOT_ELEMENT_ID}">`)
    doc.write(markup)
    doc.write("</div></body></html>")
    doc.close()

    let cleanedUp = false
    const cleanup = () => {
      if (cleanedUp) return
      cleanedUp = true
      iframe.remove()
    }

    const runPrint = () => {
      const handleAfterPrint = () => {
        window.clearTimeout(fallbackTimerId)
        cleanup()
      }

      const fallbackTimerId = window.setTimeout(() => {
        win.removeEventListener("afterprint", handleAfterPrint)
        cleanup()
      }, PRINT_IFRAME_CLEANUP_FALLBACK_MS)

      win.addEventListener("afterprint", handleAfterPrint, { once: true })

      try {
        win.focus()
        win.print()
      } catch (error) {
        window.clearTimeout(fallbackTimerId)
        win.removeEventListener("afterprint", handleAfterPrint)
        cleanup()
        setErrorMessage(
          error instanceof Error ? error.message : "인쇄를 시작할 수 없습니다.",
        )
      }
    }

    window.setTimeout(runPrint, PRINT_READY_DELAY_MS)
  }, [containerRef])

  return { printGraph, errorMessage }
}
