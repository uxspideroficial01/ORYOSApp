import { cn } from "@/lib/utils"
import { Video, Youtube } from "lucide-react"

interface FormatCardProps {
  type: "short" | "long"
  selected?: boolean
  onClick?: () => void
}

export function FormatCard({ type, selected, onClick }: FormatCardProps) {
  const isShort = type === "short"

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 p-8 rounded-3xl border transition-all min-h-[153px]",
        "bg-[var(--oryos-input-bg)] hover:border-[var(--oryos-card-border-light)] hover:scale-[1.02]",
        selected
          ? "border-[var(--oryos-accent)] ring-1 ring-[var(--oryos-accent)]"
          : "border-[var(--oryos-input-border)]"
      )}
    >
      <div className="flex items-center gap-1">
        {isShort ? (
          <Video className="w-6 h-6 text-white" />
        ) : (
          <Youtube className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-white">
          {isShort ? "Videos Curtos (ate 60s)" : "Videos Longos (ate 10min)"}
        </p>
        <p className="text-sm text-[var(--oryos-text-description)]">
          {isShort ? "Ideal para TikTok & Reels" : "Ideal para Youtube"}
        </p>
      </div>
    </button>
  )
}
