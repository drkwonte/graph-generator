import * as React from "react"

import type { GeminiAnalysisResponse } from "@/types/gemini"

type GeminiAnalysisStatus = "idle" | "loading" | "success" | "error"

type GeminiAnalysisState = {
  status: GeminiAnalysisStatus
  data: GeminiAnalysisResponse | null
  errorMessage: string | null
}

function isGeminiAnalysisResponse(value: unknown): value is GeminiAnalysisResponse {
  const v = value as any
  return (
    !!v &&
    typeof v === "object" &&
    Array.isArray(v.formulas) &&
    typeof v.confidence === "number" &&
    (typeof v.warning === "string" || v.warning === null)
  )
}

export function useGeminiAnalysis() {
  const [state, setState] = React.useState<GeminiAnalysisState>({
    status: "idle",
    data: null,
    errorMessage: null,
  })

  const reset = React.useCallback(() => {
    setState({ status: "idle", data: null, errorMessage: null })
  }, [])

  const analyzeImage = React.useCallback(async (image: Blob) => {
    setState({ status: "loading", data: null, errorMessage: null })

    try {
      const formData = new FormData()
      formData.set("image", image, "upload.jpg")

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(
          `Analyze failed (${res.status}). ${text ? `Details: ${text}` : ""}`.trim(),
        )
      }

      const json = (await res.json()) as unknown
      if (!isGeminiAnalysisResponse(json)) {
        throw new Error("Unexpected response shape from analyze API.")
      }

      setState({ status: "success", data: json, errorMessage: null })
      return json
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "이미지 분석에 실패했습니다."
      setState({ status: "error", data: null, errorMessage: message })
      return null
    }
  }, [])

  return {
    ...state,
    analyzeImage,
    reset,
  }
}

