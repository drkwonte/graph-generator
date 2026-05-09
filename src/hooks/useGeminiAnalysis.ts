import * as React from "react"

import type { GeminiAnalysisResponse } from "@/types/gemini"

type GeminiAnalysisStatus = "idle" | "loading" | "success" | "error"

const FALLBACK_ERROR_MESSAGE = "이미지 분석에 실패했습니다." as const
const RATE_LIMIT_ERROR_MESSAGE =
  "현재 AI 사용량(쿼터/요청 제한)을 초과했습니다. 잠시 후 다시 시도해 주세요." as const

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

function extractApiErrorMessage(status: number, textBody: string): string {
  // Prefer structured JSON errors from our /api/analyze.
  try {
    const parsed = JSON.parse(textBody) as any
    if (parsed?.code === "GEMINI_RATE_LIMIT") return RATE_LIMIT_ERROR_MESSAGE
    if (typeof parsed?.error === "string" && parsed.error.trim().length > 0) {
      return parsed.error
    }
  } catch {
    // ignore
  }

  if (status === 429) return RATE_LIMIT_ERROR_MESSAGE
  return textBody.trim().length > 0 ? textBody : FALLBACK_ERROR_MESSAGE
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
        const message = extractApiErrorMessage(res.status, text)
        throw new Error(message)
      }

      const json = (await res.json()) as unknown
      if (!isGeminiAnalysisResponse(json)) {
        throw new Error("Unexpected response shape from analyze API.")
      }

      setState({ status: "success", data: json, errorMessage: null })
      return json
    } catch (error) {
      const message = error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE
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

