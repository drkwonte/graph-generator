import type { GeminiFormula } from "@/types/gemini"

type SharePayloadV1 = {
  v: 1
  formulas: Array<Pick<GeminiFormula, "displayLatex" | "functionNotation" | "isGraphable" | "type">>
}

function toBase64Url(input: string) {
  const base64 = btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_m, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  )
  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

function fromBase64Url(input: string) {
  const padLength = (4 - (input.length % 4)) % 4
  const padded = input + "=".repeat(padLength)
  const base64 = padded.replaceAll("-", "+").replaceAll("_", "/")
  const decoded = atob(base64)
  const utf8 = Array.from(decoded)
    .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("")
  return decodeURIComponent(utf8)
}

export function encodeSharePayload(formulas: GeminiFormula[]) {
  const payload: SharePayloadV1 = {
    v: 1,
    formulas: formulas.map((f) => ({
      displayLatex: f.displayLatex,
      functionNotation: f.functionNotation,
      isGraphable: f.isGraphable,
      type: f.type,
    })),
  }
  return toBase64Url(JSON.stringify(payload))
}

export function decodeSharePayload(encoded: string): GeminiFormula[] | null {
  try {
    const json = fromBase64Url(encoded)
    const parsed = JSON.parse(json) as SharePayloadV1
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.formulas)) return null
    return parsed.formulas as GeminiFormula[]
  } catch {
    return null
  }
}

