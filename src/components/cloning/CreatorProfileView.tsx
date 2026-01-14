import { Button } from "@/components/ui/button"
import { Sparkles, Mic, MessageSquare, Zap, Copy, Check } from "lucide-react"
import type { ClonedCreator } from "@/types/cloning"
import { useState } from "react"

interface CreatorProfileViewProps {
  creator: ClonedCreator
  onGenerateScript: () => void
}

export function CreatorProfileView({ creator, onGenerateScript }: CreatorProfileViewProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const copyPromptTemplate = () => {
    navigator.clipboard.writeText(creator.prompt_template)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const analysis = creator.analysis

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {creator.avatar_url && (
            <img
              src={creator.avatar_url}
              alt={creator.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[var(--oryos-card-border)]"
            />
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-white">{creator.name}</h1>
              <span className="px-2 py-1 rounded-full bg-[var(--oryos-accent)]/10 border border-[var(--oryos-accent)]/30">
                <span className="text-xs font-medium text-[var(--oryos-accent)]">
                  Clonado
                </span>
              </span>
            </div>
            <p className="text-[var(--oryos-text-description)]">
              {creator.total_videos} vídeos analisados • Perfil completo disponível
            </p>
          </div>
        </div>

        <Button onClick={onGenerateScript} size="lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar Roteiro
        </Button>
      </div>

      {/* Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tom de Voz */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Tom de Voz</h3>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-[var(--oryos-text-description)]">
                Tom Predominante:
              </span>
              <p className="font-medium text-white capitalize">
                {analysis.voice_tone.tom_predominante}
              </p>
            </div>

            <div>
              <span className="text-sm text-[var(--oryos-text-description)]">
                Velocidade de Fala:
              </span>
              <p className="font-medium text-white capitalize">
                {analysis.voice_tone.velocidade_fala}
              </p>
            </div>

            <div>
              <span className="text-sm text-[var(--oryos-text-description)]">
                Variação Tonal:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-[var(--oryos-input-bg)] rounded-full h-2">
                  <div
                    className="bg-[var(--oryos-accent)] h-2 rounded-full"
                    style={{ width: `${analysis.voice_tone.variacao_tonal * 10}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {analysis.voice_tone.variacao_tonal}/10
                </span>
              </div>
            </div>

            {analysis.voice_tone.enfase_palavras.length > 0 && (
              <div>
                <span className="text-sm text-[var(--oryos-text-description)] block mb-2">
                  Palavras com Ênfase:
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.voice_tone.enfase_palavras.slice(0, 4).map((word, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[var(--oryos-accent)]/10 text-[var(--oryos-accent)] rounded text-xs border border-[var(--oryos-accent)]/20"
                    >
                      "{word}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estilo de Comunicação */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Estilo de Comunicação</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Abordagem:</span>
              <span className="font-medium text-white capitalize">
                {analysis.communication_style.abordagem}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Formalidade:</span>
              <span className="font-medium text-white">
                {analysis.communication_style.nivel_formalidade}/10
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Uso de Humor:</span>
              <span className="font-medium text-white">
                {analysis.communication_style.uso_humor}/10
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Uso de Exemplos:</span>
              <span className="font-medium text-white">
                {analysis.communication_style.uso_exemplos}/10
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Interage com Audiência:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  analysis.communication_style.interacao_audiencia
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-[var(--oryos-input-bg)] text-[var(--oryos-text-disabled)]"
                }`}
              >
                {analysis.communication_style.interacao_audiencia ? "Sim" : "Não"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Perguntas Retóricas:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  analysis.communication_style.perguntas_retoricas
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-[var(--oryos-input-bg)] text-[var(--oryos-text-disabled)]"
                }`}
              >
                {analysis.communication_style.perguntas_retoricas ? "Sim" : "Não"}
              </span>
            </div>
          </div>
        </div>

        {/* Vícios de Linguagem */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Padrões de Linguagem</h3>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-[var(--oryos-text-description)] block mb-2">
                Bordões:
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.language_patterns.bordoes.map((bordao, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[var(--oryos-accent-orange)]/10 text-[var(--oryos-accent-orange)] rounded text-xs border border-[var(--oryos-accent-orange)]/20"
                  >
                    "{bordao}"
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm text-[var(--oryos-text-description)] block mb-2">
                Conectores Favoritos:
              </span>
              <p className="text-sm text-white">
                {analysis.language_patterns.conectores_favoritos.join(', ')}
              </p>
            </div>

            {analysis.language_patterns.girias_regionalismos.length > 0 && (
              <div>
                <span className="text-sm text-[var(--oryos-text-description)] block mb-2">
                  Gírias/Regionalismos:
                </span>
                <p className="text-sm text-white">
                  {analysis.language_patterns.girias_regionalismos.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estrutura Narrativa */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Estrutura Narrativa</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-[var(--oryos-text-description)]">Abertura:</span>
              <p className="text-white mt-1">{analysis.narrative_structure.abertura_tipo}</p>
            </div>

            <div>
              <span className="text-[var(--oryos-text-description)]">Duração Típica Intro:</span>
              <p className="text-white mt-1">
                ~{analysis.narrative_structure.duracao_intro_segundos}s
              </p>
            </div>

            <div>
              <span className="text-[var(--oryos-text-description)]">Fechamento:</span>
              <p className="text-white mt-1">{analysis.narrative_structure.fechamento_tipo}</p>
            </div>

            <div>
              <span className="text-[var(--oryos-text-description)]">CTA Padrão:</span>
              <p className="text-white mt-1">{analysis.narrative_structure.cta_padrao}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Template */}
      <div className="relative bg-gradient-to-br from-[var(--oryos-accent)]/10 to-[var(--oryos-accent-orange)]/10 border-2 border-[var(--oryos-accent)]/30 rounded-xl p-6">
        <div className="absolute -top-4 left-6 bg-gradient-to-r from-[var(--oryos-accent)] to-[var(--oryos-accent-orange)] text-[var(--oryos-bg)] px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Prompt Template
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-[var(--oryos-text-description)]">
            Use este prompt em qualquer LLM para gerar roteiros no estilo de {creator.name}:
          </p>

          <div className="relative">
            <pre className="bg-[var(--oryos-bg)] p-4 rounded-lg border border-[var(--oryos-card-border)] overflow-x-auto text-sm max-h-96 overflow-y-auto whitespace-pre-wrap text-[var(--oryos-text-description)] font-mono">
              {creator.prompt_template}
            </pre>

            <Button onClick={copyPromptTemplate} size="sm" className="absolute top-3 right-3">
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-green-500">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center pt-4">
        <Button onClick={onGenerateScript} size="lg" className="min-w-[250px]">
          <Sparkles className="w-5 h-5 mr-2" />
          Gerar Roteiro Agora
        </Button>
      </div>
    </div>
  )
}
