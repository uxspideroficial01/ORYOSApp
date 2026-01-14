import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VideoInputCard } from "./VideoInputCard"
import { CloningTips } from "./CloningTips"
import { CreatorProfileView } from "./CreatorProfileView"
import { ScriptGenerator } from "./ScriptGenerator"
import { Wand2, Sparkles, ArrowRight } from "lucide-react"
import { TranscriptService } from "@/services/transcript.service"
import { YouTubeService } from "@/services/youtube.service"
import { CreatorAnalyzerService } from "@/services/creator-analyzer.service"
import type { Video, ClonedCreator } from "@/types/cloning"

type Step = "input" | "analyzing" | "profile" | "generate"

export function NewCloningPage() {
  const [step, setStep] = useState<Step>("input")
  const [creatorName, setCreatorName] = useState("")
  const [videos, setVideos] = useState<Video[]>([
    ...Array(10)
      .fill(null)
      .map((_, i) => ({
        id: String(i + 1),
        video_id: "",
        url: "",
        status: "empty" as const,
      })),
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [clonedCreator, setClonedCreator] = useState<ClonedCreator | null>(null)

  const handleVideoUrlChange = async (id: string, url: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, url, status: url ? "loading" : "empty" } : v
      )
    )

    if (!url) return

    try {
      const videoId = TranscriptService.extractVideoId(url)
      if (!videoId) {
        throw new Error("URL do vídeo inválida")
      }

      // Busca info do vídeo
      const videoDetails = await YouTubeService.getChannelVideos("", 1)
      // Nota: Em produção, buscar info específica do vídeo

      setVideos((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                video_id: videoId,
                status: "transcribing",
                title: `Vídeo ${id}`,
                thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              }
            : v
        )
      )

      // Busca transcrição
      const transcript = await TranscriptService.getTranscript(videoId)

      setVideos((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: "ready",
                transcript: transcript.text,
                transcript_language: transcript.language,
              }
            : v
        )
      )
    } catch (error: any) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: "error",
                error: error.message || "Erro ao processar vídeo",
              }
            : v
        )
      )
    }
  }

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { id: v.id, video_id: "", url: "", status: "empty" } : v
      )
    )
  }

  const readyVideos = videos.filter((v) => v.status === "ready")
  const canAnalyze = creatorName.length > 0 && readyVideos.length >= 3

  const handleAnalyzeCreator = async () => {
    setIsAnalyzing(true)
    setProgress(0)
    setStep("analyzing")

    // Simulação do processo
    const steps = [
      { progress: 20, step: "Processando transcrições..." },
      { progress: 40, step: "Analisando tom de voz..." },
      { progress: 60, step: "Identificando trejeitos e padrões..." },
      { progress: 80, step: "Consolidando perfil do criador..." },
      { progress: 100, step: "Concluído!" },
    ]

    for (const { progress: p, step: s } of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProgress(p)
      setCurrentStep(s)
    }

    // Analisa creator
    const analysis = await CreatorAnalyzerService.analyzeCreator(
      readyVideos,
      creatorName
    )

    const promptTemplate = CreatorAnalyzerService.generatePromptTemplate(
      creatorName,
      analysis
    )

    // Mock do creator clonado
    const creator: ClonedCreator = {
      id: "1",
      user_id: "user-1",
      name: creatorName,
      description: `Perfil clonado de ${creatorName} baseado em ${readyVideos.length} vídeos`,
      channel_id: "mock-channel-id",
      channel_name: creatorName,
      channel_url: readyVideos[0]?.url || "",
      avatar_url: readyVideos[0]?.thumbnail_url,
      video_ids: readyVideos.map((v) => v.video_id),
      total_videos: readyVideos.length,
      analysis,
      prompt_template: promptTemplate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setClonedCreator(creator)
    setIsAnalyzing(false)
    setStep("profile")
  }

  const handleBackToInput = () => {
    setStep("input")
    setProgress(0)
    setCurrentStep("")
  }

  const handleGoToGenerate = () => {
    setStep("generate")
  }

  // Step: Analyzing
  if (step === "analyzing") {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-[var(--oryos-accent)] animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Analisando {creatorName}
            </h2>
            <p className="text-[var(--oryos-text-description)]">
              Criando perfil único baseado em {readyVideos.length} vídeos
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-medium">Progresso</span>
              <span className="text-[var(--oryos-text-description)]">
                {progress}%
              </span>
            </div>

            <div className="w-full bg-[var(--oryos-input-bg)] rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[var(--oryos-accent)] to-[var(--oryos-accent-orange)] h-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>

            <p className="text-sm text-[var(--oryos-text-description)] text-center">
              {currentStep}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Step: Profile View
  if (step === "profile" && clonedCreator) {
    return (
      <div>
        <button
          onClick={handleBackToInput}
          className="mb-6 text-[var(--oryos-accent)] hover:underline flex items-center gap-2"
        >
          ← Voltar
        </button>
        <CreatorProfileView
          creator={clonedCreator}
          onGenerateScript={handleGoToGenerate}
        />
      </div>
    )
  }

  // Step: Generate Script
  if (step === "generate" && clonedCreator) {
    return (
      <div>
        <button
          onClick={() => setStep("profile")}
          className="mb-6 text-[var(--oryos-accent)] hover:underline flex items-center gap-2"
        >
          ← Ver Perfil
        </button>
        <ScriptGenerator creator={clonedCreator} />
      </div>
    )
  }

  // Step: Input (default)
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
            <h1 className="text-2xl font-semibold text-white">Creator Cloning</h1>
          </div>
          <p className="text-[var(--oryos-text-description)]">
            Clone o estilo de qualquer criador analisando seus vídeos. Use depois para
            gerar roteiros no mesmo estilo.
          </p>
        </div>

        {/* Creator name input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-white mb-3">
            Nome do Criador
          </label>
          <Input
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Ex: Rezendeevil, Felipe Neto, Manual do Mundo..."
            className="max-w-md"
          />
        </div>

        {/* Video upload section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Vídeos para Análise
              </label>
              <p className="text-sm text-[var(--oryos-text-description)]">
                Adicione de 3 a 10 vídeos do MESMO CANAL para análise. Quanto mais vídeos,
                melhor o perfil.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={
                  readyVideos.length >= 3
                    ? "text-[var(--oryos-accent)]"
                    : "text-[var(--oryos-text-disabled)]"
                }
              >
                {readyVideos.length}/10 vídeos
              </span>
              {readyVideos.length >= 3 && (
                <Sparkles className="w-4 h-4 text-[var(--oryos-accent)]" />
              )}
            </div>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <VideoInputCard
                key={video.id}
                video={video}
                onUrlChange={(url) => handleVideoUrlChange(video.id, url)}
                onRemove={() => handleRemoveVideo(video.id)}
              />
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <div className="mt-auto pt-6 border-t border-[var(--oryos-separator)]">
          <Button
            onClick={handleAnalyzeCreator}
            disabled={!canAnalyze || isAnalyzing}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Analisando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Clonar Criador
              </>
            )}
          </Button>
          {!canAnalyze && (
            <p className="text-sm text-[var(--oryos-text-disabled)] mt-2">
              {creatorName.length === 0
                ? "Adicione um nome para o criador"
                : `Adicione mais ${3 - readyVideos.length} vídeo(s) para continuar`}
            </p>
          )}
          {canAnalyze && !isAnalyzing && (
            <p className="text-sm text-[var(--oryos-accent)] mt-2">
              ✓ Pronto! Tempo estimado: ~2 minutos
            </p>
          )}
        </div>
      </div>

      {/* Tips panel */}
      <CloningTips />
    </div>
  )
}
