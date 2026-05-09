import { Link } from "react-router-dom"

import { ROUTES } from "@/constants/routes"
import { SITE_NAME } from "@/constants/seo"

const FOOTER_COPYRIGHT = `© ${SITE_NAME}` as const
const FOOTER_LINK_ABOUT = "소개" as const
const FOOTER_LINK_PRIVACY = "개인정보 처리방침" as const
const FOOTER_LINK_CONTACT = "문의" as const

export function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="부가 정보" className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            to={ROUTES.about}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {FOOTER_LINK_ABOUT}
          </Link>
          <Link
            to={ROUTES.privacy}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {FOOTER_LINK_PRIVACY}
          </Link>
          <Link
            to={ROUTES.contact}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {FOOTER_LINK_CONTACT}
          </Link>
        </nav>
        <p className="shrink-0 text-xs sm:text-sm">{FOOTER_COPYRIGHT}</p>
      </div>
    </footer>
  )
}

