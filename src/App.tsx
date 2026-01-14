import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { HomePage } from "@/components/home/HomePage"
import { OnboardingPage } from "@/components/onboarding/OnboardingPage"
import { SignupPage } from "@/components/auth/SignupPage"
import { LoginPage } from "@/components/auth/LoginPage"
import { CloningPage } from "@/components/cloning"
import { TrainedStylesPage } from "@/components/styles"
import { UpgradePage } from "@/components/upgrade"
import { HistoryPage } from "@/components/history"
import { SettingsPage } from "@/components/settings"
import { ChannelAnalyticsPage } from "@/components/analytics"

type AppView = "signup" | "login" | "onboarding" | "home" | "cloning" | "styles" | "history" | "settings" | "upgrade" | "analytics"

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
      case "styles":
        return <TrainedStylesPage onNavigateToCloning={() => setCurrentView("cloning")} />
      case "history":
        return <HistoryPage />
      case "settings":
        return <SettingsPage />
      case "upgrade":
        return <UpgradePage />
      case "analytics":
        return <ChannelAnalyticsPage />
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
