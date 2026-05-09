const FULLWIDTH_BACKSLASH_REGEX = /\uFF3C/g
const CONTROL_SEQUENCE_SPLIT_REGEX = /\\([A-Za-z]+)\s+([A-Za-z]+)/g
const WHITESPACE_REGEX = /\s+/g

/**
 * KaTeX BlockMath/InlineMath already run in math mode.
 * Gemini often returns display/inline TeX with `$…$`, `$$…$$`, `\[…\]`, `\(…\)` wrappers,
 * which makes KaTeX throw (e.g. "$" illegal in math mode). Strip those first.
 */
function stripMathModeDelimiters(raw: string): string {
  const t = raw.trim()
  if (t.length < 2) return t

  if (t.startsWith("$$") && t.endsWith("$$") && t.length >= 4) {
    return t.slice(2, -2).trim()
  }
  if (t.startsWith("$") && t.endsWith("$") && t.length >= 2) {
    return t.slice(1, -1).trim()
  }
  if (t.startsWith("\\[") && t.endsWith("\\]")) {
    return t.slice(2, -2).trim()
  }
  if (t.startsWith("\\(") && t.endsWith("\\)")) {
    return t.slice(2, -2).trim()
  }

  return t
}

/**
 * Make model/OCR-produced LaTeX more KaTeX-tolerant.
 *
 * We keep this intentionally conservative: fix the common "split control sequence"
 * corruption (e.g. "\l og", "\f rac") and normalize a few Unicode edge cases.
 */
export function sanitizeLatex(input: string): string {
  const trimmed = stripMathModeDelimiters(input)
  if (trimmed.length === 0) return trimmed

  return trimmed
    .replace(FULLWIDTH_BACKSLASH_REGEX, "\\")
    .replace(CONTROL_SEQUENCE_SPLIT_REGEX, (_m, a: string, b: string) => `\\${a}${b}`)
    .replace(WHITESPACE_REGEX, " ")
}

