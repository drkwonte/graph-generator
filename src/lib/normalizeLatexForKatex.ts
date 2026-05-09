const FRAC_TWO_DIGITS_REGEX = /\\frac\s*([0-9])\s*([0-9])/g

/**
 * KaTeX is strict about some LaTeX shorthands that people commonly write.
 * Normalize a small, safe subset so math displays consistently in production.
 */
export function normalizeLatexForKatex(input: string | null | undefined) {
  if (!input) return ""

  // \frac12 -> \frac{1}{2}
  let out = input.replace(FRAC_TWO_DIGITS_REGEX, "\\\\frac{$1}{$2}")

  return out
}

