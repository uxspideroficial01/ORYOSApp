import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OnboardingStep } from "./OnboardingStep"
import { User } from "lucide-react"

interface ProfileStepProps {
  onNext: () => void
  onBack: () => void
}

export function ProfileStep({ onNext, onBack }: ProfileStepProps) {
  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")

  return (
    <OnboardingStep
      step={2}
      totalSteps={4}
      title="Configure seu perfil"
      description="Essas informacoes nos ajudam a personalizar sua experiencia."
    >
      <div className="flex flex-col gap-6">
        {/* Avatar placeholder */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[var(--oryos-card-bg)] border-2 border-dashed border-[var(--oryos-card-border)] text-[var(--oryos-text-description)] hover:border-[var(--oryos-card-border-light)] transition-colors cursor-pointer">
            <User className="w-10 h-10" />
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base text-white">Seu nome</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como voce quer ser chamado?"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base text-white">Seu @ nas redes</label>
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@seuhandle"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continuar
          </Button>
        </div>
      </div>
    </OnboardingStep>
  )
}
