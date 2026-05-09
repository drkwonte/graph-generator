import * as React from "react"
import katex from "katex"

import { sanitizeLatex } from "@/lib/sanitizeLatex"

const KATEX_STRICT_IGNORE = "ignore" as const

function isValidKatexString(tex: string, displayMode: boolean): boolean {
  try {
    katex.renderToString(tex, {
      displayMode,
      throwOnError: true,
      strict: KATEX_STRICT_IGNORE,
    })
    return true
  } catch {
    return false
  }
}

function chooseBestLatex(raw: string | null | undefined, displayMode: boolean): string {
  const trimmed = String(raw ?? "").trim()
  if (!trimmed) return ""

  if (isValidKatexString(trimmed, displayMode)) return trimmed

  const sanitized = sanitizeLatex(trimmed)
  if (isValidKatexString(sanitized, displayMode)) return sanitized

  return trimmed
}

function renderKatexHtml(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: KATEX_STRICT_IGNORE,
  })
}

type KatexSpanProps = {
  math: string | null | undefined
  displayMode: boolean
  className?: string
}

function KatexSpan({ math, displayMode, className }: KatexSpanProps) {
  const html = React.useMemo(() => {
    const tex = chooseBestLatex(math, displayMode)
    if (!tex) return ""
    return renderKatexHtml(tex, displayMode)
  }, [math, displayMode])

  if (!html) return null

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export function SafeBlockMath({ math }: { math: string | null | undefined }) {
  return <KatexSpan math={math} displayMode />
}

export function SafeInlineMath({ math }: { math: string | null | undefined }) {
  return <KatexSpan math={math} displayMode={false} />
}
