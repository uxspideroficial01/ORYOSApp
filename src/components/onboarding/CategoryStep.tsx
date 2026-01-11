import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OnboardingStep } from "./OnboardingStep"
import { cn } from "@/lib/utils"
import {
  Cpu,
  TrendingUp,
  Gamepad2,
  Heart,
  GraduationCap,
  Utensils,
  Plane,
  Music,
} from "lucide-react"

interface CategoryStepProps {
  onNext: () => void
  onBack: () => void
}

const categories = [
  { id: "tech", label: "Tecnologia", icon: <Cpu className="w-5 h-5" /> },
  { id: "marketing", label: "Marketing", icon: <TrendingUp className="w-5 h-5" /> },
  { id: "gaming", label: "Games", icon: <Gamepad2 className="w-5 h-5" /> },
  { id: "lifestyle", label: "Lifestyle", icon: <Heart className="w-5 h-5" /> },
  { id: "education", label: "Educacao", icon: <GraduationCap className="w-5 h-5" /> },
  { id: "food", label: "Gastronomia", icon: <Utensils className="w-5 h-5" /> },
  { id: "travel", label: "Viagens", icon: <Plane className="w-5 h-5" /> },
  { id: "music", label: "Musica", icon: <Music className="w-5 h-5" /> },
]

export function CategoryStep({ onNext, onBack }: CategoryStepProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  return (
    <OnboardingStep
      step={3}
      totalSteps={4}
      title="Quais sao seus nichos?"
      description="Selecione as categorias de conteudo que voce cria. Pode escolher mais de uma."
    >
      <div className="flex flex-col gap-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                "hover:scale-[1.02]",
                selected.includes(category.id)
                  ? "bg-white text-black border-white"
                  : "bg-[var(--oryos-card-bg)] text-white border-[var(--oryos-card-border)] hover:border-[var(--oryos-card-border-light)]"
              )}
            >
              <span
                className={cn(
                  selected.includes(category.id)
                    ? "text-black"
                    : "text-[var(--oryos-accent)]"
                )}
              >
                {category.icon}
              </span>
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button
            onClick={onNext}
            className="flex-1"
            disabled={selected.length === 0}
          >
            Continuar
          </Button>
        </div>
      </div>
    </OnboardingStep>
  )
}
