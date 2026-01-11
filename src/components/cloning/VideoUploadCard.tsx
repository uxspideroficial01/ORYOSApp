import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Link2, X, Play, Loader2, AlertCircle } from "lucide-react"

interface VideoItem {
  id: string
  url: string
  thumbnail?: string
  title?: string
  status: "empty" | "loading" | "ready" | "error"
}

interface VideoUploadCardProps {
  video: VideoItem
  onUrlChange: (url: string) => void
  onRemove: () => void
}

export function VideoUploadCard({ video, onUrlChange, onRemove }: VideoUploadCardProps) {
  const [inputValue, setInputValue] = useState(video.url)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onUrlChange(inputValue.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  // Empty state
  if (video.status === "empty") {
    return (
      <div
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-200
          ${isFocused
            ? "border-[var(--oryos-accent)] bg-[var(--oryos-accent)]/5"
            : "border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] hover:border-[var(--oryos-card-border-light)]"
          }
        `}
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--oryos-input-bg)] flex items-center justify-center">
              <Link2 className="w-4 h-4 text-[var(--oryos-text-disabled)]" />
            </div>
            <span className="text-sm text-[var(--oryos-text-description)]">
              Cole o link do vídeo
            </span>
          </div>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="https://youtube.com/watch?v=..."
            className="h-10 text-sm"
          />
          <p className="text-xs text-[var(--oryos-text-disabled)] mt-2">
            YouTube, TikTok, Instagram Reels
          </p>
        </div>
      </div>
    )
  }

  // Loading state
  if (video.status === "loading") {
    return (
      <div className="relative rounded-2xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] overflow-hidden">
        <div className="aspect-video bg-[var(--oryos-input-bg)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[var(--oryos-accent)] animate-spin" />
            <span className="text-sm text-[var(--oryos-text-description)]">
              Carregando vídeo...
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (video.status === "error") {
    return (
      <div className="relative rounded-2xl border border-red-500/30 bg-red-500/5 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm text-red-400">
              Não foi possível carregar
            </span>
            <button
              onClick={onRemove}
              className="ml-auto p-1 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[var(--oryos-text-disabled)]">
            Verifique se o link está correto e tente novamente
          </p>
        </div>
      </div>
    )
  }

  // Ready state with preview
  return (
    <div className="relative rounded-2xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] overflow-hidden group">
      {/* Thumbnail */}
      <div className="aspect-video bg-[var(--oryos-input-bg)] relative">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title || "Video thumbnail"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-12 h-12 text-[var(--oryos-text-disabled)]" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/80 hover:bg-black/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-[var(--oryos-accent)]/20 backdrop-blur-sm">
          <span className="text-xs font-medium text-[var(--oryos-accent)]">
            Pronto
          </span>
        </div>
      </div>

      {/* Video info */}
      <div className="p-3">
        <p className="text-sm text-white truncate">
          {video.title || "Vídeo sem título"}
        </p>
        <p className="text-xs text-[var(--oryos-text-disabled)] truncate mt-1">
          {video.url}
        </p>
      </div>
    </div>
  )
}
