const FULLWIDTH_BACKSLASH_REGEX = /\uFF3C/g
const CONTROL_SEQUENCE_SPLIT_REGEX = /\\([A-Za-z]+)\s+([A-Za-z]+)/g
const WHITESPACE_REGEX = /\s+/g

/**
 * Make model/OCR-produced LaTeX more KaTeX-tolerant.
 *
 * We keep this intentionally conservative: fix the common "split control sequence"
 * corruption (e.g. "\l og", "\f rac") and normalize a few Unicode edge cases.
 */
export function sanitizeLatex(input: string): string {
  const trimmed = input.trim()
  if (trimmed.length === 0) return trimmed

  return trimmed
    .replace(FULLWIDTH_BACKSLASH_REGEX, "\\")
    .replace(CONTROL_SEQUENCE_SPLIT_REGEX, (_m, a: string, b: string) => `\\${a}${b}`)
    .replace(WHITESPACE_REGEX, " ")
}

