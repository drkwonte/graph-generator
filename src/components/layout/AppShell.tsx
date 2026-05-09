import * as React from "react"

import { AppFooter } from "@/components/layout/AppFooter"
import { AppHeader } from "@/components/layout/AppHeader"

export type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8">{children}</div>
      </main>
      <AppFooter />
    </div>
  )
}

