declare module "react-katex" {
  import type * as React from "react"

  export type InlineMathProps = {
    math: string
    errorColor?: string
    renderError?: (error: Error) => React.ReactNode
  } & Omit<React.HTMLAttributes<HTMLElement>, "children">

  export type BlockMathProps = {
    math: string
    errorColor?: string
    renderError?: (error: Error) => React.ReactNode
  } & Omit<React.HTMLAttributes<HTMLElement>, "children">

  export const InlineMath: React.FC<InlineMathProps>
  export const BlockMath: React.FC<BlockMathProps>
}

