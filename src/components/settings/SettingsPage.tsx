import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Settings,
  User,
  Bell,
  Palette,
  Key,
  Globe,
  CreditCard,
  LogOut,
  ChevronRight,
  Camera,
  Check,
  Moon,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="rounded-2xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--oryos-text-description)] mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        enabled ? "bg-[var(--oryos-accent)]" : "bg-[var(--oryos-card-border)]"
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
}

type SettingsTab = "profile" | "notifications" | "appearance" | "api" | "billing"

const tabs = [
  { id: "profile" as const, label: "Perfil", icon: User },
  { id: "notifications" as const, label: "Notificações", icon: Bell },
  { id: "appearance" as const, label: "Aparência", icon: Palette },
  { id: "api" as const, label: "API & Integrações", icon: Key },
  { id: "billing" as const, label: "Assinatura", icon: CreditCard },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")

  // Profile state
  const [name, setName] = useState("João Silva")
  const [email, setEmail] = useState("joao@email.com")
  const [bio, setBio] = useState("Criador de conteúdo")

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [productUpdates, setProductUpdates] = useState(true)

  // Appearance state
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")
  const [language, setLanguage] = useState("pt-BR")

  // API state
  const [apiKey] = useState("sk-oryos-xxxx-xxxx-xxxx-xxxxxxxxxxxx")
  const [showApiKey, setShowApiKey] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="flex flex-col gap-6">
            <SettingsSection title="Foto de perfil">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--oryos-accent)] to-[var(--oryos-accent)]/50 flex items-center justify-center text-2xl font-bold text-black">
                  JS
                </div>
                <div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Alterar foto
                  </Button>
                  <p className="text-xs text-[var(--oryos-text-disabled)] mt-2">
                    JPG, PNG ou GIF. Máx 2MB.
                  </p>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Informações pessoais">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-white mb-2">Nome completo</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Bio</label>
                  <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Conte um pouco sobre você" />
                </div>
                <Button className="w-fit mt-2">Salvar alterações</Button>
              </div>
            </SettingsSection>

            <SettingsSection title="Senha" description="Altere sua senha para manter sua conta segura">
              <Button variant="outline">Alterar senha</Button>
            </SettingsSection>

            <SettingsSection title="Zona de perigo">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Excluir conta</p>
                  <p className="text-xs text-[var(--oryos-text-disabled)]">
                    Isso irá excluir permanentemente sua conta e todos os dados.
                  </p>
                </div>
                <Button variant="outline" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                  Excluir conta
                </Button>
              </div>
            </SettingsSection>
          </div>
        )

      case "notifications":
        return (
          <div className="flex flex-col gap-6">
            <SettingsSection title="Notificações por email">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Notificações por email</p>
                    <p className="text-xs text-[var(--oryos-text-disabled)]">
                      Receba atualizações sobre seus roteiros
                    </p>
                  </div>
                  <Toggle enabled={emailNotifications} onChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Resumo semanal</p>
                    <p className="text-xs text-[var(--oryos-text-disabled)]">
                      Receba um resumo semanal da sua atividade
                    </p>
                  </div>
                  <Toggle enabled={weeklyDigest} onChange={setWeeklyDigest} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Atualizações do produto</p>
                    <p className="text-xs text-[var(--oryos-text-disabled)]">
                      Novidades e melhorias do ORYOS
                    </p>
                  </div>
                  <Toggle enabled={productUpdates} onChange={setProductUpdates} />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Notificações push">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Notificações no navegador</p>
                  <p className="text-xs text-[var(--oryos-text-disabled)]">
                    Receba notificações em tempo real
                  </p>
                </div>
                <Toggle enabled={pushNotifications} onChange={setPushNotifications} />
              </div>
            </SettingsSection>
          </div>
        )

      case "appearance":
        return (
          <div className="flex flex-col gap-6">
            <SettingsSection title="Tema" description="Escolha como o ORYOS deve aparecer">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "dark" as const, label: "Escuro", icon: Moon },
                  { id: "light" as const, label: "Claro", icon: Sun },
                  { id: "system" as const, label: "Sistema", icon: Settings },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors",
                      theme === option.id
                        ? "border-[var(--oryos-accent)] bg-[var(--oryos-accent)]/5"
                        : "border-[var(--oryos-card-border)] hover:border-[var(--oryos-card-border-light)]"
                    )}
                  >
                    <option.icon className={cn(
                      "w-6 h-6",
                      theme === option.id ? "text-[var(--oryos-accent)]" : "text-[var(--oryos-text-description)]"
                    )} />
                    <span className={cn(
                      "text-sm",
                      theme === option.id ? "text-white" : "text-[var(--oryos-text-description)]"
                    )}>
                      {option.label}
                    </span>
                    {theme === option.id && (
                      <Check className="w-4 h-4 text-[var(--oryos-accent)]" />
                    )}
                  </button>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection title="Idioma">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[var(--oryos-text-disabled)]" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full bg-[var(--oryos-input-bg)] text-white border border-[var(--oryos-input-border)] focus:outline-none focus:ring-1 focus:ring-[var(--oryos-accent)]"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </SettingsSection>
          </div>
        )

      case "api":
        return (
          <div className="flex flex-col gap-6">
            <SettingsSection title="Chave de API" description="Use esta chave para integrar o ORYOS com outras ferramentas">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 rounded-full bg-[var(--oryos-input-bg)] border border-[var(--oryos-input-border)] font-mono text-sm text-white">
                    {showApiKey ? apiKey : "sk-oryos-••••-••••-••••-••••••••••••"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? "Ocultar" : "Mostrar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                  >
                    Copiar
                  </Button>
                </div>
                <p className="text-xs text-[var(--oryos-text-disabled)]">
                  Mantenha esta chave em segredo. Não compartilhe publicamente.
                </p>
              </div>
            </SettingsSection>

            <SettingsSection title="Webhooks" description="Configure endpoints para receber eventos">
              <Button variant="outline" className="gap-2">
                <Key className="w-4 h-4" />
                Configurar webhooks
              </Button>
            </SettingsSection>

            <SettingsSection title="Integrações conectadas">
              <div className="text-sm text-[var(--oryos-text-disabled)]">
                Nenhuma integração conectada.
              </div>
            </SettingsSection>
          </div>
        )

      case "billing":
        return (
          <div className="flex flex-col gap-6">
            <SettingsSection title="Plano atual">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--oryos-input-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--oryos-accent)]/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[var(--oryos-accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Plano Gratuito</p>
                    <p className="text-xs text-[var(--oryos-text-disabled)]">5 roteiros por mês</p>
                  </div>
                </div>
                <Button size="sm">Fazer upgrade</Button>
              </div>
            </SettingsSection>

            <SettingsSection title="Uso do mês">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--oryos-text-description)]">Roteiros criados</span>
                    <span className="text-sm text-white">3/5</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--oryos-card-border)] overflow-hidden">
                    <div className="h-full w-3/5 rounded-full bg-[var(--oryos-accent)]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--oryos-text-description)]">Estilos de cloning</span>
                    <span className="text-sm text-white">2/3</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--oryos-card-border)] overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-[var(--oryos-accent-orange)]" />
                  </div>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Histórico de pagamentos">
              <div className="text-sm text-[var(--oryos-text-disabled)]">
                Nenhum pagamento realizado.
              </div>
            </SettingsSection>
          </div>
        )
    }
  }

  return (
    <div className="h-full flex gap-8">
      {/* Sidebar */}
      <div className="w-56 shrink-0">
        <div className="sticky top-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[var(--oryos-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Configurações</h1>
          </div>

          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-[var(--oryos-card-bg)] text-white"
                    : "text-[var(--oryos-text-description)] hover:text-white hover:bg-[var(--oryos-card-bg)]/50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
                {activeTab === tab.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-[var(--oryos-separator)]">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors w-full">
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sair da conta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl">
        {renderContent()}
      </div>
    </div>
  )
}
