import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { HomePage } from "@/components/home/HomePage"
import { OnboardingPage } from "@/components/onboarding/OnboardingPage"
import { SignupPage } from "@/components/auth/SignupPage"
import { LoginPage } from "@/components/auth/LoginPage"

type AppView = "signup" | "login" | "onboarding" | "home"

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

  // Main app
  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  )
}

export default App
