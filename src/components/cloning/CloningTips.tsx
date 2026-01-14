import { Lightbulb, Video, Target, Zap } from "lucide-react"

export function CloningTips() {
  const tips = [
    {
      icon: Video,
      title: "Escolha vídeos variados",
      description: "Selecione vídeos de diferentes temas do mesmo criador para capturar melhor o estilo.",
    },
    {
      icon: Target,
      title: "Mínimo de 3 vídeos",
      description: "Quanto mais vídeos (até 10), mais preciso será o perfil clonado do criador.",
    },
    {
      icon: Zap,
      title: "Mesmo canal",
      description: "Todos os vídeos devem ser do MESMO canal para manter consistência no estilo.",
    },
    {
      icon: Lightbulb,
      title: "Use depois para gerar",
      description: "Após clonar, você pode gerar infinitos roteiros usando o estilo do criador.",
    },
  ]

  return (
    <div className="w-80 flex-shrink-0">
      <div className="sticky top-8">
        <div className="p-6 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[var(--oryos-accent)]" />
            <h3 className="font-semibold text-white">Dicas</h3>
          </div>

          <div className="space-y-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--oryos-accent)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--oryos-accent)]" />
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
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--oryos-separator)]">
            <p className="text-xs text-[var(--oryos-text-description)] leading-relaxed">
              O sistema analisará tom de voz, trejeitos, vícios de linguagem, estrutura narrativa e estratégias de retenção.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
