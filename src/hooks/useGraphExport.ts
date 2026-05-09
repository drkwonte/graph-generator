import * as React from "react"

const DEFAULT_FILENAME = "snapgraph.png" as const
const EXPORT_BACKGROUND_COLOR = "#ffffff" as const

export function useGraphExport(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const downloadPng = React.useCallback(
    async (filename = DEFAULT_FILENAME) => {
      setErrorMessage(null)
      const container = containerRef.current
      if (!container) {
        setErrorMessage("그래프가 아직 준비되지 않았습니다.")
        return
      }

      try {
        const { toBlob } = await import("html-to-image")

        const pngBlob = await toBlob(container, {
          backgroundColor: EXPORT_BACKGROUND_COLOR,
          pixelRatio: 2,
          cacheBust: true,
        })
        if (!pngBlob) throw new Error("PNG export failed.")

        const a = document.createElement("a")
        a.href = URL.createObjectURL(pngBlob)
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(a.href)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "PNG 저장에 실패했습니다.")
      }
    },
    [containerRef],
  )

  return { downloadPng, errorMessage }
}

