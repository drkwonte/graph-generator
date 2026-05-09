import { Link } from "react-router-dom"

import { ModeToggle } from "@/components/mode-toggle"
import { ROUTES } from "@/constants/routes"

const APP_NAME = "SnapGraph" as const
const HEADER_LOGO_SRC = "/graph_logo.png" as const
const HEADER_LOGO_ALT = `${APP_NAME} 로고` as const
const HEADER_GUIDE_LINK_TEXT = "사용설명서" as const

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to={ROUTES.home}
          className="flex min-w-0 items-center gap-3 rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src={HEADER_LOGO_SRC}
            alt={HEADER_LOGO_ALT}
            width={36}
            height={36}
            className="size-9 shrink-0 object-contain"
            decoding="async"
          />
          <span className="truncate text-base font-semibold tracking-tight">{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.guide}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground outline-none ring-offset-background transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {HEADER_GUIDE_LINK_TEXT}
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

