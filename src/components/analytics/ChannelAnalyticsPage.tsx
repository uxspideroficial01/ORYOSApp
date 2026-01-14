import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "./ChannelCard"
import { AnalyticsTips } from "./AnalyticsTips"
import { HybridModelView } from "./HybridModelView"
import { Sparkles, TrendingUp, Youtube } from "lucide-react"
import { YouTubeService } from "@/services/youtube.service"
import type { Channel } from "@/types/analytics"

interface ChannelItem {
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

export function ChannelAnalyticsPage() {
  const [modelName, setModelName] = useState("")
  const [channels, setChannels] = useState<ChannelItem[]>([
    ...Array(10).fill(null).map((_, i) => ({
      id: String(i + 1),
      url: "",
      status: "empty" as const,
    })),
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [generatedModel, setGeneratedModel] = useState<any>(null)

  const handleChannelUrlChange = async (id: string, url: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, url, status: url ? "loading" : "empty" } : c
      )
    )

    if (!url) return

    try {
      const identifier = YouTubeService.extractChannelIdentifier(url)
      if (!identifier) {
        throw new Error('URL do canal inválida')
      }

      const channelInfo = await YouTubeService.getChannelInfo(identifier)

      setChannels((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "ready",
                data: {
                  channel_id: channelInfo.id,
                  channel_name: channelInfo.name,
                  thumbnail_url: channelInfo.thumbnailUrl,
                  subscriber_count: channelInfo.subscriberCount,
                  video_count: channelInfo.videoCount,
                },
              }
            : c
        )
      )
    } catch (error: any) {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "error",
                error: error.message || 'Erro ao buscar canal',
              }
            : c
        )
      )
    }
  }

  const handleRemoveChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { id: c.id, url: "", status: "empty" } : c))
    )
  }

  const readyChannels = channels.filter((c) => c.status === "ready")
  const canGenerate = modelName.length > 0 && readyChannels.length === 10

  const handleGenerateModel = async () => {
    setIsGenerating(true)
    setProgress(0)
    setCurrentStep("Iniciando análise...")

    // Simulação do processo
    const steps = [
      { progress: 10, step: "Coletando vídeos dos canais..." },
      { progress: 25, step: "Extraindo transcrições..." },
      { progress: 50, step: "Analisando estrutura e tom..." },
      { progress: 75, step: "Identificando padrões..." },
      { progress: 90, step: "Gerando modelo híbrido..." },
      { progress: 100, step: "Concluído!" },
    ]

    for (const { progress: p, step } of steps) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setProgress(p)
      setCurrentStep(step)
    }

    // Mock do modelo gerado
    setGeneratedModel({
      id: "1",
      name: modelName,
      total_channels: 10,
      total_videos_analyzed: 50,
      hybrid_tone: {
        tom_geral: "conversacional",
        formalidade: 6,
        energia: 8,
        emocional: 7,
        tecnico: 5,
        linguagem_caracteristica: [
          "Olá pessoal",
          "Vamos aprender",
          "É isso aí",
          "Até a próxima",
        ],
      },
      hybrid_structure: {
        intro: {
          duration_seconds: 30,
          hook_type: "pergunta",
          elements: ["Gancho forte", "Promessa de valor", "Preview do conteúdo"],
        },
        desenvolvimento: {
          sections: [
            {
              topic: "Contexto",
              duration_seconds: 120,
              techniques: ["Storytelling", "Exemplos práticos"],
            },
            {
              topic: "Conteúdo Principal",
              duration_seconds: 300,
              techniques: ["Listas", "Demonstrações", "Dados"],
            },
          ],
        },
        conclusao: {
          duration_seconds: 40,
          cta_type: "múltiplo",
          elements: ["Resumo", "Call to action", "Próximos passos"],
        },
        total_duration_seconds: 490,
      },
      hybrid_patterns: {
        duracao_media_intro_segundos: 30,
        duracao_media_desenvolvimento_segundos: 420,
        duracao_media_conclusao_segundos: 40,
        usa_storytelling: true,
        frequencia_exemplos: 8,
        uso_de_dados_estatisticas: true,
        formato_predominante: "educacional",
      },
      hybrid_techniques: {
        uso_de_perguntas_retoricas: true,
        storytelling_pessoal: true,
        analogias_metaforas: ["Como se fosse...", "É igual a..."],
        repeticao_enfase: true,
        uso_de_listas: true,
        contraste_comparacao: true,
        surpresa_revelacao: true,
      },
      prompt_template: `Você é um especialista em criação de roteiros para YouTube que combina os melhores elementos de 10 canais de sucesso.

**TOM E ESTILO:**
- Tom: Conversacional e acessível
- Energia: Alta (8/10) - mantenha o entusiasmo
- Formalidade: Moderada (6/10) - profissional mas amigável
- Técnico: Moderado (5/10) - explique termos complexos

**ESTRUTURA DO ROTEIRO:**

1. INTRODUÇÃO (30 segundos):
   - Comece com uma pergunta que prenda a atenção
   - Faça uma promessa clara de valor
   - Dê um preview do que está por vir

2. DESENVOLVIMENTO (7 minutos):
   - Use storytelling para contextualizar
   - Apresente exemplos práticos e concretos
   - Organize o conteúdo em listas quando possível
   - Use dados e estatísticas para credibilidade
   - Faça analogias para simplificar conceitos complexos

3. CONCLUSÃO (40 segundos):
   - Resuma os pontos principais
   - Dê um call to action claro (inscrever, comentar, ver próximo vídeo)
   - Indique os próximos passos

**LINGUAGEM CARACTERÍSTICA:**
Use frases como: "Olá pessoal", "Vamos aprender", "É isso aí", "Até a próxima"

**TÉCNICAS A USAR:**
- Perguntas retóricas para engajamento
- Repetição de pontos importantes para ênfase
- Contraste e comparação para clareza
- Elementos de surpresa ou revelação

**FORMATO:**
Educacional com foco em entregar valor prático e acionável.

Agora, crie um roteiro seguindo estas diretrizes sobre o tema: [TEMA DO USUÁRIO]`,
      created_at: new Date().toISOString(),
    })

    setIsGenerating(false)
  }

  if (generatedModel) {
    return (
      <div>
        <button
          onClick={() => {
            setGeneratedModel(null)
            setProgress(0)
            setCurrentStep("")
          }}
          className="mb-6 text-[var(--oryos-accent)] hover:underline flex items-center gap-2"
        >
          ← Voltar para análise
        </button>
        <HybridModelView model={generatedModel} />
      </div>
    )
  }

  return (
    <div className="flex gap-8 h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--oryos-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              Channel Analytics
            </h1>
          </div>
          <p className="text-[var(--oryos-text-description)]">
            Analise 10 canais do YouTube e crie um modelo híbrido único de roteiro combinando o melhor de cada um.
          </p>
        </div>

        {/* Model name input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-white mb-3">
            Nome do Modelo
          </label>
          <Input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Ex: Modelo Educacional Dinâmico, Estilo Tech Reviews, etc."
            className="max-w-md"
          />
        </div>

        {/* Channels input section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Canais do YouTube
              </label>
              <p className="text-sm text-[var(--oryos-text-description)]">
                Adicione exatamente 10 canais para criar seu modelo híbrido. A IA irá analisar 5 vídeos de cada.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={
                  readyChannels.length === 10
                    ? "text-[var(--oryos-accent)]"
                    : "text-[var(--oryos-text-disabled)]"
                }
              >
                {readyChannels.length}/10 canais
              </span>
              {readyChannels.length === 10 && (
                <Sparkles className="w-4 h-4 text-[var(--oryos-accent)]" />
              )}
            </div>
          </div>

          {/* Channels grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onUrlChange={(url) => handleChannelUrlChange(channel.id, url)}
                onRemove={() => handleRemoveChannel(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* Progress section */}
        {isGenerating && (
          <div className="mb-8 p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Gerando Modelo...</h3>
              <span className="text-sm text-[var(--oryos-text-description)]">
                {progress}%
              </span>
            </div>

            <div className="w-full bg-[var(--oryos-input-bg)] rounded-full h-3 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-[var(--oryos-accent)] to-[var(--oryos-accent-orange)] h-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>

            <p className="text-sm text-[var(--oryos-text-description)]">
              {currentStep}
            </p>
          </div>
        )}

        {/* Generate button */}
        <div className="mt-auto pt-6 border-t border-[var(--oryos-separator)]">
          <Button
            onClick={handleGenerateModel}
            disabled={!canGenerate || isGenerating}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Gerando modelo...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Modelo Híbrido
              </>
            )}
          </Button>
          {!canGenerate && (
            <p className="text-sm text-[var(--oryos-text-disabled)] mt-2">
              {modelName.length === 0
                ? "Adicione um nome para o modelo"
                : `Adicione mais ${10 - readyChannels.length} canal(is) para continuar`}
            </p>
          )}
          {canGenerate && !isGenerating && (
            <p className="text-sm text-[var(--oryos-accent)] mt-2">
              ✓ Pronto! Tempo estimado: ~15 minutos
            </p>
          )}
        </div>
      </div>

      {/* Tips panel */}
      <AnalyticsTips />
    </div>
  )
}
