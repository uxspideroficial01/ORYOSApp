import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Sparkles, Copy, Check, Download } from "lucide-react"
import type { ClonedCreator, GeneratedScript } from "@/types/cloning"

interface ScriptGeneratorProps {
  creator: ClonedCreator
}

export function ScriptGenerator({ creator }: ScriptGeneratorProps) {
  const [topic, setTopic] = useState("")
  const [format, setFormat] = useState<string>("youtube_long")
  const [additionalInstructions, setAdditionalInstructions] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const formats = [
    { value: "youtube_long", label: "YouTube (8-15 min)" },
    { value: "youtube_short", label: "YouTube Shorts (60s)" },
    { value: "tiktok", label: "TikTok (60s)" },
    { value: "instagram_reel", label: "Instagram Reels (90s)" },
  ]

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    // Simulação de geração
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock do roteiro gerado
    const script: GeneratedScript = {
      id: "1",
      user_id: "user-1",
      creator_id: creator.id,
      topic: topic,
      format: format,
      script: {
        titulo_sugerido: `Como ${topic} em 2024 (GUIA COMPLETO)`,
        thumbnail_sugestao: `Você com expressão surpresa + texto amarelo "${topic.toUpperCase()}" + seta apontando`,
        hook: `Olá pessoal! Você já tentou ${topic.toLowerCase()} e não conseguiu? Então cola aqui comigo porque hoje eu vou te mostrar o PASSO A PASSO completo que vai mudar isso!`,
        intro: `E aí galera, tudo bem? Bora lá pro vídeo de hoje que vai ser MUITO massa! Hoje eu vou falar sobre ${topic} e eu GARANTO que se você prestar atenção até o final e aplicar tudo certinho, vai dar super certo. Não esquece de deixar aquele like, se inscrever no canal e ativar o sininho pra não perder nenhum conteúdo novo!`,
        desenvolvimento: [
          `Primeira coisa que você precisa entender sobre ${topic} é que não é complicado. Muita gente fica com medo de começar, mas tipo, é só seguir o que eu vou te mostrar agora.`,
          `Então, vamos lá pro primeiro ponto: [Ponto 1 sobre ${topic}]. Olha só isso aqui, é MUITO importante que você entenda bem essa parte, porque ela é a base de tudo.`,
          `E agora vamos pro próximo ponto super importante: [Ponto 2]. Pessoal, presta atenção nessa parte aqui porque muita gente erra justamente nisso!`,
          `Terceiro ponto que você PRECISA saber: [Ponto 3]. Isso aqui vai fazer TODA a diferença no resultado final, então anota aí!`,
        ],
        conclusao: `E é isso aí, pessoal! Resumindo rapidinho: a gente viu [resumo dos pontos]. Se você seguir esses passos certinho, vai conseguir ${topic.toLowerCase()} sem erro!`,
        cta: `Não esquece de deixar aquele LIKE se o vídeo te ajudou, se inscrever no canal se ainda não é inscrito, ativar o sininho das notificações e COMENTA aqui embaixo me contando o que você achou! Até a próxima, pessoal!`,
      },
      estimated_duration_seconds: 480,
      word_count: 850,
      created_at: new Date().toISOString(),
    }

    setGeneratedScript(script)
    setIsGenerating(false)
  }

  const copySection = (section: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const copyFullScript = () => {
    if (!generatedScript) return

    const fullText = `TÍTULO: ${generatedScript.script.titulo_sugerido}

THUMBNAIL: ${generatedScript.script.thumbnail_sugestao}

---

HOOK:
${generatedScript.script.hook}

INTRO:
${generatedScript.script.intro}

DESENVOLVIMENTO:
${generatedScript.script.desenvolvimento.join('\n\n')}

CONCLUSÃO:
${generatedScript.script.conclusao}

CTA:
${generatedScript.script.cta}

---
Duração estimada: ${Math.floor(generatedScript.estimated_duration_seconds / 60)}min ${generatedScript.estimated_duration_seconds % 60}s
Palavras: ${generatedScript.word_count}
`

    navigator.clipboard.writeText(fullText)
    setCopiedSection('full')
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--oryos-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Gerar Roteiro</h1>
        </div>
        <p className="text-[var(--oryos-text-description)]">
          Crie roteiros no estilo de <span className="text-white font-medium">{creator.name}</span>
        </p>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tema do Roteiro *
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: ganhar dinheiro online, começar no YouTube, aprender inglês..."
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Formato
            </label>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={isGenerating}
            >
              {formats.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Instruções Adicionais (opcional)
          </label>
          <Textarea
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="Ex: foque em iniciantes, use dados recentes, mencione ferramenta X..."
            rows={4}
            disabled={isGenerating}
          />
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!topic.trim() || isGenerating}
        size="lg"
        className="w-full md:w-auto min-w-[200px]"
      >
        {isGenerating ? (
          <>
            <span className="animate-spin mr-2">⚡</span>
            Gerando roteiro...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar Roteiro
          </>
        )}
      </Button>

      {/* Generated Script */}
      {generatedScript && (
        <div className="space-y-6 pt-8 border-t border-[var(--oryos-separator)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Roteiro Gerado</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--oryos-text-description)]">
                ~{Math.floor(generatedScript.estimated_duration_seconds / 60)}min
              </span>
              <span className="text-sm text-[var(--oryos-text-disabled)]">•</span>
              <span className="text-sm text-[var(--oryos-text-description)]">
                {generatedScript.word_count} palavras
              </span>
              <Button
                onClick={copyFullScript}
                size="sm"
                variant="outline"
                className="ml-4"
              >
                {copiedSection === 'full' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Tudo
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Título e Thumbnail */}
          <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--oryos-accent)]">
                    TÍTULO SUGERIDO
                  </span>
                  <Button
                    onClick={() => copySection('title', generatedScript.script.titulo_sugerido)}
                    size="sm"
                    variant="ghost"
                  >
                    {copiedSection === 'title' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-white font-medium">
                  {generatedScript.script.titulo_sugerido}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--oryos-separator)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--oryos-accent)]">
                    SUGESTÃO DE THUMBNAIL
                  </span>
                  <Button
                    onClick={() =>
                      copySection('thumbnail', generatedScript.script.thumbnail_sugestao)
                    }
                    size="sm"
                    variant="ghost"
                  >
                    {copiedSection === 'thumbnail' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[var(--oryos-text-description)]">
                  {generatedScript.script.thumbnail_sugestao}
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          {[
            { title: 'HOOK', content: generatedScript.script.hook, key: 'hook' },
            { title: 'INTRO', content: generatedScript.script.intro, key: 'intro' },
            {
              title: 'DESENVOLVIMENTO',
              content: generatedScript.script.desenvolvimento.join('\n\n'),
              key: 'dev',
            },
            { title: 'CONCLUSÃO', content: generatedScript.script.conclusao, key: 'conclusion' },
            { title: 'CTA', content: generatedScript.script.cta, key: 'cta' },
          ].map((section) => (
            <div
              key={section.key}
              className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[var(--oryos-accent)]">
                  {section.title}
                </h3>
                <Button
                  onClick={() => copySection(section.key, section.content)}
                  size="sm"
                  variant="ghost"
                >
                  {copiedSection === section.key ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-white whitespace-pre-wrap leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
