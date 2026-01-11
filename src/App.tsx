import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { HomePage } from "@/components/home/HomePage"
import { OnboardingPage } from "@/components/onboarding/OnboardingPage"

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true)

  if (showOnboarding) {
    return <OnboardingPage onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  )
}

export default App
