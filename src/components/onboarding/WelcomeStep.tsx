import { Button } from "@/components/ui/button"
import { OnboardingStep } from "./OnboardingStep"
import { Sparkles, Zap, Brain } from "lucide-react"

interface WelcomeStepProps {
  onNext: () => void
}

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Gere roteiros em segundos",
    description: "IA avancada para criar scripts personalizados",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Clone seu estilo",
    description: "Treine o modelo com seu proprio conteudo",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "DeepResearch",
    description: "Pesquisa profunda para conteudo relevante",
  },
]

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <OnboardingStep
      step={1}
      totalSteps={4}
      title="Bem-vindo ao ORYOS"
      description="A plataforma de geracao de roteiros com IA mais avancada do mercado."
    >
      <div className="flex flex-col gap-6">
        {/* Features */}
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-5 rounded-2xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] hover:border-[var(--oryos-card-border-light)] transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--oryos-bg)] text-[var(--oryos-accent)]">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-medium text-white">
                  {feature.title}
                </span>
                <span className="text-sm text-[var(--oryos-text-description)]">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button onClick={onNext} className="w-full mt-4">
          Comecar agora
        </Button>
      </div>
    </OnboardingStep>
  )
}
