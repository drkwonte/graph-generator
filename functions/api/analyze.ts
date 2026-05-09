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
- latex & displayLatex: standard LaTeX, raw only (no surrounding $...$, $$...$$, \\[...\\], or \\(...\\);
  the client renders math mode separately.
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

const JSON_HEADERS = { "content-type": "application/json" } as const
const GEMINI_UPSTREAM_ERROR_STATUS = 502 as const
const GEMINI_RATE_LIMIT_STATUS = 429 as const

type ApiErrorBody = {
  error: string
  status?: number
  code?: string
  retryAfterSeconds?: number
}

function toBase64(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function extractJsonTextFromGeminiResponse(geminiResponse: unknown): string {
  if (!geminiResponse || typeof geminiResponse !== "object") {
    throw new Error("Gemini response was not an object.")
  }

  const candidates = (geminiResponse as Record<string, unknown>).candidates
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("Gemini response did not contain candidates.")
  }

  const first = candidates[0]
  if (!first || typeof first !== "object") {
    throw new Error("Gemini response candidate was not an object.")
  }

  const content = (first as Record<string, unknown>).content
  if (!content || typeof content !== "object") {
    throw new Error("Gemini response candidate had no content.")
  }

  const parts = (content as Record<string, unknown>).parts
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error("Gemini response content had no parts.")
  }

  const part0 = parts[0]
  const candidateText =
    part0 && typeof part0 === "object"
      ? (part0 as Record<string, unknown>).text
      : undefined

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

  return parsed
}

export const onRequestPost: PagesFunction<CloudflarePagesEnv> = async (ctx) => {
  const apiKey = ctx.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "Missing GEMINI_API_KEY environment variable.",
      }),
      { status: 500, headers: JSON_HEADERS },
    )
  }

  const contentType = ctx.request.headers.get("content-type") ?? ""
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ error: "Expected multipart/form-data request." }),
      { status: 400, headers: JSON_HEADERS },
    )
  }

  const formData = await ctx.request.formData()
  const image = formData.get("image")
  if (!(image instanceof File)) {
    return new Response(JSON.stringify({ error: "Missing image file." }), {
      status: 400,
      headers: JSON_HEADERS,
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
    const retryAfterHeader = geminiRes.headers.get("retry-after")
    const retryAfterSeconds =
      retryAfterHeader && /^\d+$/.test(retryAfterHeader)
        ? Number(retryAfterHeader)
        : undefined

    const body: ApiErrorBody =
      geminiRes.status === GEMINI_RATE_LIMIT_STATUS
        ? {
            error:
              "Gemini API quota/rate-limit exceeded. Please retry later or check billing/quota.",
            status: geminiRes.status,
            code: "GEMINI_RATE_LIMIT",
            retryAfterSeconds,
          }
        : {
            error: "Gemini request failed.",
            status: geminiRes.status,
            code: "GEMINI_UPSTREAM_ERROR",
          }

    // Preserve upstream status when it gives more actionable info (e.g. 429).
    const status =
      geminiRes.status === GEMINI_RATE_LIMIT_STATUS
        ? GEMINI_RATE_LIMIT_STATUS
        : GEMINI_UPSTREAM_ERROR_STATUS

    return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS })
  }

  const geminiResponseJson = await geminiRes.json()
  const jsonText = extractJsonTextFromGeminiResponse(geminiResponseJson)
  const parsed = parseGeminiJson(jsonText)

  return new Response(JSON.stringify(parsed), {
    headers: JSON_HEADERS,
  })
}

