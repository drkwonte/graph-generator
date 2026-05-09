import * as React from "react"

export type StaticDocumentLayoutProps = {
  title: string
  children: React.ReactNode
}

/**
 * Shared layout for About / Privacy / Contact (readable line length, semantic article).
 */
export function StaticDocumentLayout({ title, children }: StaticDocumentLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-foreground">
      <header className="space-y-1 border-b pb-4">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">{title}</h1>
      </header>
      <div className="space-y-4 text-muted-foreground [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:first:mt-0 [&_p]:text-foreground/90 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:text-foreground">
        {children}
      </div>
    </article>
  )
}
