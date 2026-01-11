import { useState } from "react"
import { WelcomeStep } from "./WelcomeStep"
import { ProfileStep } from "./ProfileStep"
import { CategoryStep } from "./CategoryStep"
import { PlatformStep } from "./PlatformStep"

interface OnboardingPageProps {
  onComplete: () => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--oryos-accent)]/10 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <span className="text-6xl font-bold text-white">ORYOS</span>
          </div>
          <p className="text-xl text-[var(--oryos-text-description)] max-w-md">
            Crie roteiros incriveis para suas redes sociais com o poder da inteligencia artificial.
          </p>

          {/* Decorative elements */}
          <div className="mt-16 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[var(--oryos-accent)] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[var(--oryos-accent)]/60 animate-pulse delay-100" />
            <div className="w-2 h-2 rounded-full bg-[var(--oryos-accent)]/30 animate-pulse delay-200" />
          </div>
        </div>
      </div>

      {/* Right side - Steps */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[520px]">
          {step === 1 && <WelcomeStep onNext={nextStep} />}
          {step === 2 && <ProfileStep onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <CategoryStep onNext={nextStep} onBack={prevStep} />}
          {step === 4 && <PlatformStep onComplete={onComplete} onBack={prevStep} />}
        </div>
      </div>
    </div>
  )
}
