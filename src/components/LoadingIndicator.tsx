import { cn } from "@/lib/utils"

export type LoadingIndicatorProps = {
  label?: string
  className?: string
}

export function LoadingIndicator({
  label = "수식을 인식하는 중…",
  className,
}: LoadingIndicatorProps) {
  return (
    <div className={cn("grid h-full place-items-center p-6", className)}>
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <div
          className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
          aria-hidden="true"
        />
        <div className="text-center">{label}</div>
      </div>
    </div>
  )
}

