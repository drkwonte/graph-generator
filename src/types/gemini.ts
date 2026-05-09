export type GeminiFormula = {
  latex: string
  displayLatex: string
  functionNotation: string
  isGraphable: boolean
  type: string
}

export type GeminiAnalysisResponse = {
  formulas: GeminiFormula[]
  confidence: number
  warning: string | null
}

