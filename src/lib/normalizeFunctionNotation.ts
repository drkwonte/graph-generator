const EQUALS_SPLIT_REGEX = /=/
const UNICODE_MINUS_REGEX = /\u2212/g
const CURLY_BRACES_REGEX = /[{}]/g

/**
 * Minimal, safe normalization for function-plot inputs.
 * We intentionally avoid semantic rewrites (e.g., log base conversions).
 */
export function normalizeFunctionNotation(input: string): string {
  const trimmed = input.trim()
  const rhs = EQUALS_SPLIT_REGEX.test(trimmed)
    ? trimmed.split(EQUALS_SPLIT_REGEX).slice(-1)[0]?.trim() ?? trimmed
    : trimmed

  return rhs
    .replaceAll(UNICODE_MINUS_REGEX, "-")
    .replace(CURLY_BRACES_REGEX, (m) => (m === "{" ? "(" : ")"))
    .replace(/\s+/g, " ")
    .trim()
}

