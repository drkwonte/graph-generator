import { Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/AppShell"
import { ThemeProvider } from "@/components/theme-provider"
import { ROUTES } from "@/constants/routes"
import { AboutPage } from "@/pages/AboutPage"
import { ContactPage } from "@/pages/ContactPage"
import { GuidePage } from "@/pages/GuidePage"
import { HomePage } from "@/pages/HomePage"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage"

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route
          path={ROUTES.home}
          element={
            <AppShell>
              <HomePage />
            </AppShell>
          }
        />
        <Route
          path={ROUTES.about}
          element={
            <AppShell>
              <AboutPage />
            </AppShell>
          }
        />
        <Route
          path={ROUTES.guide}
          element={
            <AppShell>
              <GuidePage />
            </AppShell>
          }
        />
        <Route
          path={ROUTES.privacy}
          element={
            <AppShell>
              <PrivacyPolicyPage />
            </AppShell>
          }
        />
        <Route
          path={ROUTES.contact}
          element={
            <AppShell>
              <ContactPage />
            </AppShell>
          }
        />
        <Route
          path="*"
          element={
            <AppShell>
              <HomePage />
            </AppShell>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
