import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, Sparkles, TrendingUp, Zap, BookOpen } from "lucide-react"

interface HybridModelViewProps {
  model: any
}

export function HybridModelView({ model }: HybridModelViewProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const copyPromptTemplate = () => {
    navigator.clipboard.writeText(model.prompt_template)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const downloadAsJson = () => {
    const blob = new Blob([JSON.stringify(model, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${model.name.replace(/\s+/g, "_")}_model.json`
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--oryos-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-white">{model.name}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--oryos-text-description)]">
            <span>{model.total_channels} canais analisados</span>
            <span>•</span>
            <span>{model.total_videos_analyzed} vídeos processados</span>
            <span>•</span>
            <span>
              {new Date(model.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
        <Button onClick={downloadAsJson} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar JSON
        </Button>
      </div>

      {/* Prompt Template - DESTAQUE */}
      <div className="relative bg-gradient-to-br from-[var(--oryos-accent)]/10 to-[var(--oryos-accent-orange)]/10 border-2 border-[var(--oryos-accent)]/30 rounded-xl p-6">
        <div className="absolute -top-4 left-6 bg-gradient-to-r from-[var(--oryos-accent)] to-[var(--oryos-accent-orange)] text-[var(--oryos-bg)] px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Prompt Template Pronto para Usar
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-[var(--oryos-text-description)]">
            Use este prompt em qualquer LLM para gerar roteiros no estilo híbrido descoberto:
          </p>

          <div className="relative">
            <pre className="bg-[var(--oryos-bg)] p-4 rounded-lg border border-[var(--oryos-card-border)] overflow-x-auto text-sm max-h-96 overflow-y-auto whitespace-pre-wrap text-[var(--oryos-text-description)] font-mono">
              {model.prompt_template}
            </pre>

            <Button
              onClick={copyPromptTemplate}
              size="sm"
              className="absolute top-3 right-3"
            >
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

      {/* Análise Detalhada */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tom e Estilo */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Tom e Estilo</h3>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-[var(--oryos-text-description)]">Tom Geral:</span>
              <p className="font-medium text-white capitalize">{model.hybrid_tone.tom_geral}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-[var(--oryos-text-description)]">Formalidade</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-[var(--oryos-input-bg)] rounded-full h-2">
                    <div
                      className="bg-[var(--oryos-accent)] h-2 rounded-full"
                      style={{ width: `${model.hybrid_tone.formalidade * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {model.hybrid_tone.formalidade}/10
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[var(--oryos-text-description)]">Energia</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-[var(--oryos-input-bg)] rounded-full h-2">
                    <div
                      className="bg-[var(--oryos-accent-orange)] h-2 rounded-full"
                      style={{ width: `${model.hybrid_tone.energia * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {model.hybrid_tone.energia}/10
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[var(--oryos-text-description)]">Emocional</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-[var(--oryos-input-bg)] rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${model.hybrid_tone.emocional * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {model.hybrid_tone.emocional}/10
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[var(--oryos-text-description)]">Técnico</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-[var(--oryos-input-bg)] rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${model.hybrid_tone.tecnico * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {model.hybrid_tone.tecnico}/10
                  </span>
                </div>
              </div>
            </div>

            {model.hybrid_tone.linguagem_caracteristica.length > 0 && (
              <div>
                <span className="text-sm text-[var(--oryos-text-description)]">
                  Linguagem Característica:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {model.hybrid_tone.linguagem_caracteristica.map((word: string, idx: number) => (
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

        {/* Estrutura */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Estrutura Híbrida</h3>
          </div>

          <div className="space-y-4">
            {model.hybrid_structure.intro && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-white">Introdução</span>
                  <span className="text-xs text-[var(--oryos-text-description)]">
                    {model.hybrid_structure.intro.duration_seconds}s
                  </span>
                </div>
                <p className="text-xs text-[var(--oryos-text-description)] capitalize">
                  Hook: {model.hybrid_structure.intro.hook_type}
                </p>
              </div>
            )}

            {model.hybrid_structure.desenvolvimento && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-white">Desenvolvimento</span>
                  <span className="text-xs text-[var(--oryos-text-description)]">
                    {model.hybrid_structure.desenvolvimento.sections?.length || 0} seções
                  </span>
                </div>
              </div>
            )}

            {model.hybrid_structure.conclusao && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-white">Conclusão</span>
                  <span className="text-xs text-[var(--oryos-text-description)]">
                    {model.hybrid_structure.conclusao.duration_seconds}s
                  </span>
                </div>
                <p className="text-xs text-[var(--oryos-text-description)] capitalize">
                  CTA: {model.hybrid_structure.conclusao.cta_type}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-[var(--oryos-separator)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Duração Total Sugerida</span>
                <span className="text-lg font-bold text-[var(--oryos-accent)]">
                  {Math.floor(model.hybrid_structure.total_duration_seconds / 60)}:
                  {String(model.hybrid_structure.total_duration_seconds % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Padrões */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Padrões de Conteúdo</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Formato:</span>
              <span className="font-medium text-white capitalize">
                {model.hybrid_patterns.formato_predominante}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Storytelling:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  model.hybrid_patterns.usa_storytelling
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-[var(--oryos-input-bg)] text-[var(--oryos-text-disabled)]"
                }`}
              >
                {model.hybrid_patterns.usa_storytelling ? "Sim" : "Não"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Uso de Dados:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  model.hybrid_patterns.uso_de_dados_estatisticas
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-[var(--oryos-input-bg)] text-[var(--oryos-text-disabled)]"
                }`}
              >
                {model.hybrid_patterns.uso_de_dados_estatisticas ? "Sim" : "Não"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--oryos-text-description)]">Frequência de Exemplos:</span>
              <span className="font-medium text-white">
                {model.hybrid_patterns.frequencia_exemplos}/10
              </span>
            </div>
          </div>
        </div>

        {/* Técnicas */}
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white text-lg">Técnicas Usadas</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(model.hybrid_techniques).map(([key, value]) => {
              if (typeof value === "boolean") {
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        value ? "bg-[var(--oryos-accent)]" : "bg-[var(--oryos-input-bg)]"
                      }`}
                    />
                    <span className="text-xs text-[var(--oryos-text-description)] capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
