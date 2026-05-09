import { BlockMath, InlineMath } from "react-katex"
import katex from "katex"

import { sanitizeLatex } from "@/lib/sanitizeLatex"

const KATEX_THROW_ON_ERROR = true as const
const KATEX_DISPLAY_MODE_BLOCK = true as const
const KATEX_DISPLAY_MODE_INLINE = false as const

function isValidKatex(input: string, displayMode: boolean): boolean {
  try {
    katex.renderToString(input, {
      displayMode,
      throwOnError: KATEX_THROW_ON_ERROR,
    })
    return true
  } catch {
    return false
  }
}

function chooseBestLatex(input: string, displayMode: boolean): string {
  const trimmed = (input ?? "").trim()
  if (trimmed.length === 0) return ""

  if (isValidKatex(trimmed, displayMode)) return trimmed

  const sanitized = sanitizeLatex(trimmed)
  if (isValidKatex(sanitized, displayMode)) return sanitized

  return trimmed
}

export function SafeBlockMath({ math }: { math: string }) {
  return <BlockMath math={chooseBestLatex(math, KATEX_DISPLAY_MODE_BLOCK)} />
}

export function SafeInlineMath({ math }: { math: string }) {
  return <InlineMath math={chooseBestLatex(math, KATEX_DISPLAY_MODE_INLINE)} />
}

