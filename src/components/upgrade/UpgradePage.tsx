import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Crown, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  description: string
  price: string
  period: string
  features: PlanFeature[]
  popular?: boolean
  icon: React.ElementType
  color: string
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    description: "Para começar a criar",
    price: "R$0",
    period: "/mês",
    icon: Star,
    color: "var(--oryos-text-description)",
    features: [
      { text: "5 roteiros por mês", included: true },
      { text: "3 estilos de cloning", included: true },
      { text: "Exportação básica", included: true },
      { text: "DeepResearch", included: false },
      { text: "Roteiros ilimitados", included: false },
      { text: "Estilos ilimitados", included: false },
      { text: "Suporte prioritário", included: false },
    ],
  },
  {
    id: "pro",
    name: "PRO",
    description: "Para criadores sérios",
    price: "R$49",
    period: "/mês",
    icon: Zap,
    color: "var(--oryos-accent)",
    popular: true,
    features: [
      { text: "50 roteiros por mês", included: true },
      { text: "10 estilos de cloning", included: true },
      { text: "Exportação avançada", included: true },
      { text: "DeepResearch", included: true },
      { text: "Roteiros ilimitados", included: false },
      { text: "Estilos ilimitados", included: false },
      { text: "Suporte prioritário", included: false },
    ],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    description: "Sem limites",
    price: "R$99",
    period: "/mês",
    icon: Crown,
    color: "var(--oryos-accent-orange)",
    features: [
      { text: "Roteiros ilimitados", included: true },
      { text: "Estilos ilimitados", included: true },
      { text: "Exportação avançada", included: true },
      { text: "DeepResearch", included: true },
      { text: "API access", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Acesso antecipado a novidades", included: true },
    ],
  },
]

export function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("pro")
  const [isAnnual, setIsAnnual] = useState(false)

  const getDiscountedPrice = (price: string) => {
    const numericPrice = parseInt(price.replace("R$", ""))
    if (numericPrice === 0) return price
    const discounted = Math.floor(numericPrice * 0.8)
    return `R$${discounted}`
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--oryos-accent)]/10 text-[var(--oryos-accent)] text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Upgrade disponível
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Escolha o plano ideal para você
        </h1>
        <p className="text-[var(--oryos-text-description)] max-w-lg mx-auto">
          Desbloqueie todo o potencial do ORYOS e crie roteiros incríveis sem limitações.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className={cn("text-sm", !isAnnual ? "text-white" : "text-[var(--oryos-text-description)]")}>
          Mensal
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={cn(
            "relative w-14 h-7 rounded-full transition-colors",
            isAnnual ? "bg-[var(--oryos-accent)]" : "bg-[var(--oryos-card-border)]"
          )}
        >
          <div
            className={cn(
              "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
              isAnnual ? "translate-x-8" : "translate-x-1"
            )}
          />
        </button>
        <span className={cn("text-sm", isAnnual ? "text-white" : "text-[var(--oryos-text-description)]")}>
          Anual
        </span>
        {isAnnual && (
          <span className="text-xs px-2 py-1 rounded-full bg-[var(--oryos-accent)]/20 text-[var(--oryos-accent)]">
            -20%
          </span>
        )}
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isSelected = selectedPlan === plan.id
          const displayPrice = isAnnual ? getDiscountedPrice(plan.price) : plan.price

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "relative rounded-2xl border p-6 cursor-pointer transition-all",
                isSelected
                  ? "border-[var(--oryos-accent)] bg-[var(--oryos-accent)]/5"
                  : "border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] hover:border-[var(--oryos-card-border-light)]"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--oryos-accent)] text-black text-xs font-medium">
                  Mais popular
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `color-mix(in srgb, ${plan.color} 20%, transparent)` }}
                >
                  <Icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <p className="text-sm text-[var(--oryos-text-description)]">{plan.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{displayPrice}</span>
                <span className="text-[var(--oryos-text-description)]">{plan.period}</span>
                {isAnnual && plan.price !== "R$0" && (
                  <span className="ml-2 text-sm text-[var(--oryos-text-disabled)] line-through">
                    {plan.price}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        feature.included
                          ? "bg-[var(--oryos-accent)]/20"
                          : "bg-[var(--oryos-card-border)]"
                      )}
                    >
                      {feature.included ? (
                        <Check className="w-3 h-3 text-[var(--oryos-accent)]" />
                      ) : (
                        <span className="w-1.5 h-0.5 bg-[var(--oryos-text-disabled)] rounded" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        feature.included
                          ? "text-white"
                          : "text-[var(--oryos-text-disabled)]"
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={cn(
                  "w-full",
                  plan.id === "free" && "bg-[var(--oryos-card-border)] hover:bg-[var(--oryos-card-border-light)] text-white"
                )}
                variant={plan.id === "free" ? "outline" : "default"}
              >
                {plan.id === "free" ? "Plano atual" : "Começar agora"}
              </Button>
            </div>
          )
        })}
      </div>

      {/* FAQ or trust badges */}
      <div className="mt-12 text-center">
        <p className="text-sm text-[var(--oryos-text-disabled)]">
          Cancele a qualquer momento • Pagamento seguro • Garantia de 7 dias
        </p>
      </div>
    </div>
  )
}
