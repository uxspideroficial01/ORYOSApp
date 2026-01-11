import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OnboardingStep } from "./OnboardingStep"
import { cn } from "@/lib/utils"
import { Video, Youtube } from "lucide-react"

interface PlatformStepProps {
  onComplete: () => void
  onBack: () => void
}

const platforms = [
  {
    id: "tiktok",
    label: "TikTok",
    description: "Videos curtos ate 60s",
    icon: <Video className="w-6 h-6" />,
  },
  {
    id: "reels",
    label: "Instagram Reels",
    description: "Videos curtos ate 90s",
    icon: <Video className="w-6 h-6" />,
  },
  {
    id: "youtube-shorts",
    label: "YouTube Shorts",
    description: "Videos curtos ate 60s",
    icon: <Youtube className="w-6 h-6" />,
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Videos longos ate 10min+",
    icon: <Youtube className="w-6 h-6" />,
  },
]

export function PlatformStep({ onComplete, onBack }: PlatformStepProps) {
  const [selected, setSelected] = useState<string[]>([])

  const togglePlatform = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <OnboardingStep
      step={4}
      totalSteps={4}
      title="Onde voce publica?"
      description="Selecione as plataformas onde voce compartilha seu conteudo."
    >
      <div className="flex flex-col gap-6">
        {/* Platforms */}
        <div className="flex flex-col gap-3">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border transition-all",
                "hover:scale-[1.01]",
                selected.includes(platform.id)
                  ? "bg-white border-white"
                  : "bg-[var(--oryos-card-bg)] border-[var(--oryos-card-border)] hover:border-[var(--oryos-card-border-light)]"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full",
                  selected.includes(platform.id)
                    ? "bg-black text-white"
                    : "bg-[var(--oryos-bg)] text-[var(--oryos-accent)]"
                )}
              >
                {platform.icon}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span
                  className={cn(
                    "text-base font-medium",
                    selected.includes(platform.id) ? "text-black" : "text-white"
                  )}
                >
                  {platform.label}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    selected.includes(platform.id)
                      ? "text-gray-600"
                      : "text-[var(--oryos-text-description)]"
                  )}
                >
                  {platform.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button
            onClick={onComplete}
            className="flex-1"
            disabled={selected.length === 0}
          >
            Comecar a criar
          </Button>
        </div>
      </div>
    </OnboardingStep>
  )
}
