import * as React from "react"

import { DEFAULT_DOCUMENT_TITLE, DEFAULT_META_DESCRIPTION } from "@/constants/seo"

function getOrCreateMetaDescription(): HTMLMetaElement {
  let meta = document.querySelector('meta[name="description"]')
  if (meta instanceof HTMLMetaElement) return meta
  const created = document.createElement("meta")
  created.setAttribute("name", "description")
  document.head.appendChild(created)
  return created
}

/**
 * Updates document title and meta description for the active route (SPA SEO hints).
 * Restores defaults on unmount.
 */
export function useDocumentSEO(pageTitle: string, description: string) {
  React.useLayoutEffect(() => {
    const previousTitle = document.title
    const meta = getOrCreateMetaDescription()
    const previousDescription = meta.getAttribute("content") ?? ""

    document.title = pageTitle
    meta.setAttribute("content", description)

    return () => {
      document.title = previousTitle || DEFAULT_DOCUMENT_TITLE
      meta.setAttribute("content", previousDescription || DEFAULT_META_DESCRIPTION)
    }
  }, [pageTitle, description])
}
