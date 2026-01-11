import { cn } from "@/lib/utils"

interface OnboardingStepProps {
  step: number
  totalSteps: number
  title: string
  description: string
  children: React.ReactNode
}

export function OnboardingStep({
  step,
  totalSteps,
  title,
  description,
  children,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-[520px] mx-auto">
      {/* Progress Dots */}
      <div className="flex items-center gap-2 mb-12">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i + 1 === step
                ? "w-8 bg-white"
                : i + 1 < step
                ? "bg-white"
                : "bg-[var(--oryos-card-border)]"
            )}
          />
        ))}
      </div>

      {/* Title & Description */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-base text-[var(--oryos-text-description)]">
          {description}
        </p>
      </div>

      {/* Content */}
      <div className="w-full">{children}</div>
    </div>
  )
}
