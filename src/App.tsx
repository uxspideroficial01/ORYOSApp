import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { HomePage } from "@/components/home/HomePage"
import { OnboardingPage } from "@/components/onboarding/OnboardingPage"
import { SignupPage } from "@/components/auth/SignupPage"
import { LoginPage } from "@/components/auth/LoginPage"
import { CloningPage } from "@/components/cloning"

type AppView = "signup" | "login" | "onboarding" | "home" | "cloning" | "history" | "settings" | "upgrade"

function App() {
  const [currentView, setCurrentView] = useState<AppView>("signup")

  // Signup flow
  if (currentView === "signup") {
    return (
      <SignupPage
        onSignup={() => setCurrentView("onboarding")}
        onGoToLogin={() => setCurrentView("login")}
      />
    )
  }

  // Login flow
  if (currentView === "login") {
    return (
      <LoginPage
        onLogin={() => setCurrentView("home")}
        onGoToSignup={() => setCurrentView("signup")}
      />
    )
  }

  // Onboarding flow
  if (currentView === "onboarding") {
    return <OnboardingPage onComplete={() => setCurrentView("home")} />
  }

  // Render page content based on current view
  const renderPageContent = () => {
    switch (currentView) {
      case "cloning":
        return <CloningPage />
      case "history":
        return (
          <div className="text-white">
            <h1 className="text-2xl font-semibold mb-4">Histórico</h1>
            <p className="text-[var(--oryos-text-description)]">Em breve...</p>
          </div>
        )
      case "settings":
        return (
          <div className="text-white">
            <h1 className="text-2xl font-semibold mb-4">Configurações</h1>
            <p className="text-[var(--oryos-text-description)]">Em breve...</p>
          </div>
        )
      case "upgrade":
        return (
          <div className="text-white">
            <h1 className="text-2xl font-semibold mb-4">Upgrade para PRO</h1>
            <p className="text-[var(--oryos-text-description)]">Em breve...</p>
          </div>
        )
      default:
        return <HomePage />
    }
  }

  // Main app with navigation
  return (
    <MainLayout
      activePage={currentView}
      onNavigate={(page) => setCurrentView(page as AppView)}
    >
      {renderPageContent()}
    </MainLayout>
  )
}

export default App
