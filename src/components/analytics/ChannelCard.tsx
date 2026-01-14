import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Youtube, X, Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface ChannelCardProps {
  channel: {
    id: string
    url: string
    status: "empty" | "loading" | "ready" | "error"
    data?: {
      channel_id: string
      channel_name: string
      thumbnail_url: string
      subscriber_count: number
      video_count: number
    }
    error?: string
  }
  onUrlChange: (url: string) => void
  onRemove: () => void
}

export function ChannelCard({ channel, onUrlChange, onRemove }: ChannelCardProps) {
  const [localUrl, setLocalUrl] = useState(channel.url)

  const handleBlur = () => {
    if (localUrl !== channel.url) {
      onUrlChange(localUrl)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  if (channel.status === "ready" && channel.data) {
    return (
      <div className="relative group p-4 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] hover:border-[var(--oryos-accent)]/30 transition-colors">
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-[var(--oryos-bg)] hover:bg-red-500/20 border border-[var(--oryos-card-border)] hover:border-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3 text-[var(--oryos-text-description)] hover:text-red-400" />
        </button>

        <div className="flex items-start gap-3">
          <img
            src={channel.data.thumbnail_url}
            alt={channel.data.channel_name}
            className="w-14 h-14 rounded-full object-cover border border-[var(--oryos-card-border)]"
          />

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate mb-1">
              {channel.data.channel_name}
            </h4>
            <div className="flex items-center gap-3 text-xs text-[var(--oryos-text-description)]">
              <span>{formatNumber(channel.data.subscriber_count)} inscritos</span>
              <span>•</span>
              <span>{formatNumber(channel.data.video_count)} vídeos</span>
            </div>
          </div>

          <CheckCircle className="w-5 h-5 text-[var(--oryos-accent)] flex-shrink-0" />
        </div>
      </div>
    )
  }

  if (channel.status === "loading") {
    return (
      <div className="p-4 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[var(--oryos-input-bg)] animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-[var(--oryos-input-bg)] rounded mb-2 animate-pulse w-3/4" />
            <div className="h-3 bg-[var(--oryos-input-bg)] rounded animate-pulse w-1/2" />
          </div>
          <Loader2 className="w-5 h-5 text-[var(--oryos-accent)] animate-spin" />
        </div>
      </div>
    )
  }

  if (channel.status === "error") {
    return (
      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
        <div className="flex items-start gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-400 mb-1">Erro ao buscar canal</p>
            <p className="text-xs text-red-400/70">{channel.error}</p>
          </div>
          <button
            onClick={onRemove}
            className="w-6 h-6 rounded-lg hover:bg-red-500/20 flex items-center justify-center"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        </div>
        <Input
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
          onBlur={handleBlur}
          placeholder="Cole a URL do canal do YouTube..."
          className="text-sm"
        />
      </div>
    )
  }

  // Empty state
  return (
    <div className="p-4 rounded-xl border-2 border-dashed border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] hover:border-[var(--oryos-accent)]/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[var(--oryos-input-bg)] flex items-center justify-center">
          <Youtube className="w-5 h-5 text-[var(--oryos-text-disabled)]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Canal {channel.id}</p>
          <p className="text-xs text-[var(--oryos-text-description)]">
            Adicione um canal
          </p>
        </div>
      </div>

      <Input
        value={localUrl}
        onChange={(e) => setLocalUrl(e.target.value)}
        onBlur={handleBlur}
        placeholder="https://youtube.com/@canal ou /channel/..."
        className="text-sm"
      />
    </div>
  )
}
