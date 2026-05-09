const MODEL_ID = "gemini-2.5-flash" as const
const RESPONSE_MIME_TYPE = "application/json" as const

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models" as const

const SYSTEM_PROMPT = `
You are a precise mathematical expression extractor.
Analyze the provided image and extract ALL mathematical formulas,
equations, and functions that can be plotted on a 2D Cartesian graph.

Return ONLY a valid JSON object:
(Example)
{
  "formulas": [
    {
      "latex": "y = x^2 + 2x - 1",
      "displayLatex": "y = x^2 + 2x - 1",
      "functionNotation": "x^2 + 2*x - 1",
      "isGraphable": true,
      "type": "quadratic"
    }
  ],
  "confidence": 0.95,
  "warning": null
}

Rules:
- latex: standard LaTeX notation for display
- IMPORTANT (JSON escaping): In JSON strings, backslash must be escaped.
  For LaTeX commands like \\frac, \\sqrt, \\tan, \\pi, ALWAYS output double backslashes (e.g. "\\\\frac{1}{2}").
- functionNotation: MUST be a valid expression for function-plot's built-in parser (built-in-math-eval).
  Use only: numbers, x, parentheses, + - * / ^, and common functions like
  sin(), cos(), tan(), asin(), acos(), atan(), abs(), sqrt(), exp(), pow(), log().
  Never return an equation like "y = ..."; return only the RHS expression in terms of x.
  For log with base (e.g. log_16(8x+2)), convert using change-of-base: log(8*x+2)/log(16).
  Always use * for multiplication.
  IMPORTANT: Make exponentiation explicit with parentheses when needed, e.g. 4^(x-1) not 4^x-1.
- isGraphable: true only for functions plottable on xy-plane
- If handwriting is detected, set warning: "handwriting_detected"
- Return empty formulas array if no graphable formulas found
`.trim()

type GeminiFormula = {
  latex: string
  displayLatex: string
  functionNotation: string
  isGraphable: boolean
  type: string
}

type GeminiAnalysisResponse = {
  formulas: GeminiFormula[]
  confidence: number
  warning: string | null
}

type CloudflarePagesEnv = {
  GEMINI_API_KEY?: string
}

function toBase64(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function extractJsonTextFromGeminiResponse(geminiResponse: unknown): string {
  const candidateText =
    (geminiResponse as any)?.candidates?.[0]?.content?.parts?.[0]?.text

  if (typeof candidateText !== "string" || candidateText.trim().length === 0) {
    throw new Error("Gemini response did not contain candidate text.")
  }

  return candidateText
}

function parseGeminiJson(jsonText: string): GeminiAnalysisResponse {
  const parsed = JSON.parse(jsonText) as GeminiAnalysisResponse

  if (!parsed || !Array.isArray(parsed.formulas)) {
    throw new Error("Gemini JSON output is missing 'formulas' array.")
  }

  // Fix JSON escape collisions: Gemini may output LaTeX like "\frac" which JSON parses as
  // "\f" (formfeed). Same issue for "\tan" -> "\t" (tab), "\nabla" -> "\n" (newline), etc.
  // We restore a minimal set so KaTeX receives valid LaTeX.
  for (const f of parsed.formulas) {
    if (typeof f?.latex === "string") f.latex = restoreLatexFromControlEscapes(f.latex)
    if (typeof f?.displayLatex === "string")
      f.displayLatex = restoreLatexFromControlEscapes(f.displayLatex)
  }

  return parsed
}

function restoreLatexFromControlEscapes(input: string) {
  // Order matters: handle longest / most specific sequences first.
  return input
    // \frac (JSON: \f + "rac")
    .replace(/\f\s*rac/g, "\\\\frac")
    // \tan (JSON: \t + "an")
    .replace(/\t\s*an/g, "\\\\tan")
    // \nabla (JSON: \n + "abla")
    .replace(/\n\s*abla/g, "\\\\nabla")
    // Drop stray carriage returns if any
    .replace(/\r/g, "")
}

export const onRequestPost: PagesFunction<CloudflarePagesEnv> = async (ctx) => {
  const apiKey = ctx.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "Missing GEMINI_API_KEY environment variable.",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    )
  }

  const contentType = ctx.request.headers.get("content-type") ?? ""
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ error: "Expected multipart/form-data request." }),
      { status: 400, headers: { "content-type": "application/json" } },
    )
  }

  const formData = await ctx.request.formData()
  const image = formData.get("image")
  if (!(image instanceof File)) {
    return new Response(JSON.stringify({ error: "Missing image file." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const imageBytes = new Uint8Array(await image.arrayBuffer())
  const imageBase64 = toBase64(imageBytes)
  const imageMimeType = image.type || "image/jpeg"

  const url = `${GEMINI_API_BASE_URL}/${MODEL_ID}:generateContent?key=${encodeURIComponent(
    apiKey,
  )}`

  const geminiRequestBody = {
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_PROMPT }],
    },
    generationConfig: {
      responseMimeType: RESPONSE_MIME_TYPE,
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Extract all graphable formulas from the image.",
          },
          {
            inlineData: {
              mimeType: imageMimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
  }

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(geminiRequestBody),
  })

  if (!geminiRes.ok) {
    const text = await geminiRes.text().catch(() => "")
    return new Response(
      JSON.stringify({
        error: "Gemini request failed.",
        status: geminiRes.status,
        details: text || null,
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    )
  }

  const geminiResponseJson = await geminiRes.json()
  const jsonText = extractJsonTextFromGeminiResponse(geminiResponseJson)
  const parsed = parseGeminiJson(jsonText)

  return new Response(JSON.stringify(parsed), {
    headers: { "content-type": "application/json" },
  })
}

