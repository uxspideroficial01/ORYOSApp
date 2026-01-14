import { Lightbulb, TrendingUp, Users, Zap } from "lucide-react"

export function AnalyticsTips() {
  const tips = [
    {
      icon: TrendingUp,
      title: "Escolha canais similares",
      description: "Selecione canais do mesmo nicho para um modelo mais coerente e específico.",
    },
    {
      icon: Users,
      title: "Varie o tamanho",
      description: "Misture canais grandes e médios para balancear estilo profissional e autenticidade.",
    },
    {
      icon: Zap,
      title: "5 vídeos por canal",
      description: "A IA analisará os 5 vídeos mais recentes de cada canal automaticamente.",
    },
    {
      icon: Lightbulb,
      title: "Tempo de análise",
      description: "O processo leva ~15 minutos. Você receberá um prompt template pronto para usar.",
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
              O modelo híbrido irá combinar estrutura, tom, padrões e técnicas dos 10 canais, criando um estilo único adaptado ao seu conteúdo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
