import * as React from "react"

import { PANEL_MAIN_HEIGHT_PX } from "@/constants/layout"
import { cn } from "@/lib/utils"

export type PanelBodyProps = {
  main: React.ReactNode
  className?: string
  fixedHeightPx?: number | null
  frame?: "default" | "none"
}

export function PanelBody({
  main,
  className,
  fixedHeightPx = PANEL_MAIN_HEIGHT_PX,
  frame = "default",
}: PanelBodyProps) {
  return (
    <div className={cn("grid gap-3", className)}>
      <div
        className={cn(
          "overflow-hidden",
          frame === "default" ? "rounded-lg border bg-background" : "",
        )}
        style={fixedHeightPx ? { height: fixedHeightPx } : undefined}
      >
        {main}
      </div>
    </div>
  )
}

