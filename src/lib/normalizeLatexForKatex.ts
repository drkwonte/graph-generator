const FRAC_TWO_DIGITS_REGEX = /\\frac\s*([0-9])\s*([0-9])/g
const DOUBLE_ESCAPE_COMMANDS_REGEX =
  /\\\\(frac|sqrt|log|ln|tan|sin|cos|pi|theta|alpha|beta|gamma|Delta|Sigma|nabla)\b/g

/**
 * KaTeX is strict about some LaTeX shorthands that people commonly write.
 * Normalize a small, safe subset so math displays consistently in production.
 */
export function normalizeLatexForKatex(input: string | null | undefined) {
  if (!input) return ""

  // If the model double-escaped LaTeX commands, KaTeX may see "\\frac" (newline) + "frac".
  // Collapse \\command -> \command for common commands only (avoid breaking line breaks).
  let out = input.replace(DOUBLE_ESCAPE_COMMANDS_REGEX, "\\$1")

  // \frac12 -> \frac{1}{2}
  out = out.replace(FRAC_TWO_DIGITS_REGEX, "\\\\frac{$1}{$2}")

  return out
}

