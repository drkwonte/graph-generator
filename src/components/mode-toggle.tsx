import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DEFAULT_THEME } from "@/constants/theme"

const LIGHT_THEME = "light" as const
const DARK_THEME = "dark" as const

function getNextTheme(currentTheme?: string) {
  return currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME
}

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const effectiveTheme = theme ?? resolvedTheme ?? DEFAULT_THEME
  const nextTheme = getNextTheme(effectiveTheme)

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => setTheme(nextTheme)}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  )
}

