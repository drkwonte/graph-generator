export const PLOT_SCOPE = {
  // constants
  pi: Math.PI,
  e: Math.E,

  // trig
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,

  // basic math
  abs: Math.abs,
  sqrt: Math.sqrt,
  exp: Math.exp,
  pow: Math.pow,
  min: Math.min,
  max: Math.max,

  // logs
  ln: Math.log,
  log: Math.log,
  log10: Math.log10 ? Math.log10 : (x: number) => Math.log(x) / Math.log(10),
} as const

export type PlotScope = typeof PLOT_SCOPE
