import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VideoUploadCard } from "./VideoUploadCard"
import { TipsPanel } from "./TipsPanel"
import { Sparkles, Wand2 } from "lucide-react"

interface VideoItem {
  id: string
  url: string
  thumbnail?: string
  title?: string
  status: "empty" | "loading" | "ready" | "error"
}

export function CloningPage() {
  const [styleName, setStyleName] = useState("")
  const [videos, setVideos] = useState<VideoItem[]>([
    { id: "1", url: "", status: "empty" },
    { id: "2", url: "", status: "empty" },
    { id: "3", url: "", status: "empty" },
    { id: "4", url: "", status: "empty" },
    { id: "5", url: "", status: "empty" },
    { id: "6", url: "", status: "empty" },
  ])
  const [isTraining, setIsTraining] = useState(false)

  const handleVideoUrlChange = (id: string, url: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, url, status: url ? "loading" : "empty" }
          : v
      )
    )

    // Simulate loading video metadata
    if (url) {
      setTimeout(() => {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status: "ready",
                  title: `Video ${id}`,
                  thumbnail: `https://picsum.photos/seed/${id}/320/180`,
                }
              : v
          )
        )
      }, 1500)
    }
  }

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { id: v.id, url: "", status: "empty" }
          : v
      )
    )
  }

  const readyVideos = videos.filter((v) => v.status === "ready")
  const canTrain = styleName.length > 0 && readyVideos.length >= 3

  const handleTrain = async () => {
    setIsTraining(true)
    // Simulate training
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsTraining(false)
  }

  return (
    <div className="flex gap-8 h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-[var(--oryos-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Voice & Style Cloning</h1>
          </div>
          <p className="text-[var(--oryos-text-description)]">
            Clone seu estilo de conteúdo a partir de vídeos existentes. A IA irá aprender seu tom, ritmo e forma de comunicar.
          </p>
        </div>

        {/* Style name input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-white mb-3">
            Nome do Estilo
          </label>
          <Input
            value={styleName}
            onChange={(e) => setStyleName(e.target.value)}
            placeholder="Ex: Meu estilo de vlogs, Tutorial técnico, etc."
            className="max-w-md"
          />
        </div>

        {/* Video upload section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Vídeos de Referência
              </label>
              <p className="text-sm text-[var(--oryos-text-description)]">
                Adicione pelo menos 3 vídeos para um melhor resultado. Máximo de 6 vídeos.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={readyVideos.length >= 3 ? "text-[var(--oryos-accent)]" : "text-[var(--oryos-text-disabled)]"}>
                {readyVideos.length}/6 vídeos
              </span>
              {readyVideos.length >= 3 && (
                <Sparkles className="w-4 h-4 text-[var(--oryos-accent)]" />
              )}
            </div>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoUploadCard
                key={video.id}
                video={video}
                onUrlChange={(url) => handleVideoUrlChange(video.id, url)}
                onRemove={() => handleRemoveVideo(video.id)}
              />
            ))}
          </div>
        </div>

        {/* Train button */}
        <div className="mt-auto pt-6 border-t border-[var(--oryos-separator)]">
          <Button
            onClick={handleTrain}
            disabled={!canTrain || isTraining}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isTraining ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Treinando estilo...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Treinar Estilo
              </>
            )}
          </Button>
          {!canTrain && (
            <p className="text-sm text-[var(--oryos-text-disabled)] mt-2">
              {styleName.length === 0
                ? "Adicione um nome para o estilo"
                : `Adicione mais ${3 - readyVideos.length} vídeo(s) para continuar`}
            </p>
          )}
        </div>
      </div>

      {/* Tips panel */}
      <TipsPanel />
    </div>
  )
}
