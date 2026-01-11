import { Lightbulb, Video, Clock, Mic, Target } from "lucide-react"

const tips = [
  {
    icon: Video,
    title: "Vídeos de qualidade",
    description: "Use vídeos com boa qualidade de áudio e imagem para melhores resultados.",
  },
  {
    icon: Clock,
    title: "Duração ideal",
    description: "Vídeos entre 3-10 minutos funcionam melhor para capturar seu estilo.",
  },
  {
    icon: Mic,
    title: "Áudio claro",
    description: "Prefira vídeos onde sua voz está clara e sem muito ruído de fundo.",
  },
  {
    icon: Target,
    title: "Conteúdo consistente",
    description: "Use vídeos do mesmo tipo para resultados mais precisos.",
  },
]

export function TipsPanel() {
  return (
    <div className="w-80 shrink-0 hidden xl:block">
      <div className="sticky top-0 rounded-2xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--oryos-accent-orange-bg)] flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[var(--oryos-accent-orange)]" />
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Dicas</h3>
            <p className="text-sm text-[var(--oryos-text-description)]">
              Para melhores resultados
            </p>
          </div>
        </div>

        {/* Tips list */}
        <div className="flex flex-col gap-5">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--oryos-input-bg)] flex items-center justify-center shrink-0">
                <tip.icon className="w-4 h-4 text-[var(--oryos-text-description)]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">
                  {tip.title}
                </h4>
                <p className="text-xs text-[var(--oryos-text-description)] leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--oryos-separator)] my-6" />

        {/* Progress info */}
        <div className="rounded-xl bg-[var(--oryos-input-bg)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--oryos-text-description)]">
              Estilos criados
            </span>
            <span className="text-sm font-medium text-white">0/3</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--oryos-card-border)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--oryos-accent)] to-[var(--oryos-accent)]/60"
              style={{ width: "0%" }}
            />
          </div>
          <p className="text-xs text-[var(--oryos-text-disabled)] mt-2">
            Plano gratuito: até 3 estilos
          </p>
        </div>
      </div>
    </div>
  )
}
