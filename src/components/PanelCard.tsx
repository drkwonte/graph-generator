import * as React from "react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type PanelCardProps = {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PanelCard({
  title,
  action,
  children,
  className,
}: PanelCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4">
        <div className="min-w-0">
          <CardTitle className="truncate">{title}</CardTitle>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  )
}

