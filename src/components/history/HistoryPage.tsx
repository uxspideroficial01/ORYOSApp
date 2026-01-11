import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Calendar,
  Clock,
  FileText,
  MoreVertical,
  Copy,
  Trash2,
  Download,
  Eye,
  Filter,
  SlidersHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Script {
  id: string
  title: string
  platform: string
  category: string
  style?: string
  createdAt: string
  wordCount: number
  preview: string
}

const mockScripts: Script[] = [
  {
    id: "1",
    title: "Como aumentar engajamento no Instagram",
    platform: "Instagram",
    category: "Marketing",
    style: "Estilo Vlogs",
    createdAt: "2024-01-15",
    wordCount: 450,
    preview: "Você sabia que 90% dos criadores de conteúdo cometem o mesmo erro? Neste vídeo, vou te mostrar...",
  },
  {
    id: "2",
    title: "Review iPhone 15 Pro Max",
    platform: "YouTube",
    category: "Tecnologia",
    style: "Tutorial Técnico",
    createdAt: "2024-01-14",
    wordCount: 1200,
    preview: "Fala galera! Hoje vamos falar sobre o novo iPhone 15 Pro Max. Depois de 30 dias de uso...",
  },
  {
    id: "3",
    title: "5 dicas de produtividade",
    platform: "TikTok",
    category: "Lifestyle",
    createdAt: "2024-01-13",
    wordCount: 280,
    preview: "Quer ser mais produtivo? Aqui vão 5 dicas que mudaram minha vida: Número 1...",
  },
  {
    id: "4",
    title: "Tendências de moda 2024",
    platform: "Instagram",
    category: "Moda",
    createdAt: "2024-01-12",
    wordCount: 380,
    preview: "As tendências para 2024 chegaram e eu preciso compartilhar com vocês. A primeira...",
  },
  {
    id: "5",
    title: "Como investir com pouco dinheiro",
    platform: "YouTube",
    category: "Finanças",
    style: "Estilo Vlogs",
    createdAt: "2024-01-10",
    wordCount: 950,
    preview: "Muita gente acha que precisa de muito dinheiro para começar a investir. Errado!...",
  },
]

const platforms = ["Todos", "YouTube", "Instagram", "TikTok"]
const categories = ["Todas", "Marketing", "Tecnologia", "Lifestyle", "Moda", "Finanças"]

interface ScriptCardProps {
  script: Script
  onView: () => void
  onCopy: () => void
  onDownload: () => void
  onDelete: () => void
}

function ScriptCard({ script, onView, onCopy, onDownload, onDelete }: ScriptCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const platformColors: Record<string, string> = {
    YouTube: "bg-red-500/20 text-red-400",
    Instagram: "bg-pink-500/20 text-pink-400",
    TikTok: "bg-cyan-500/20 text-cyan-400",
  }

  return (
    <div className="rounded-2xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] p-5 hover:border-[var(--oryos-card-border-light)] transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", platformColors[script.platform])}>
            {script.platform}
          </span>
          <span className="px-2 py-1 rounded-full text-xs bg-[var(--oryos-input-bg)] text-[var(--oryos-text-description)]">
            {script.category}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-[var(--oryos-input-bg)] text-[var(--oryos-text-disabled)] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] py-1 shadow-xl">
                <button
                  onClick={() => { onView(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-[var(--oryos-input-bg)] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
                <button
                  onClick={() => { onCopy(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-[var(--oryos-input-bg)] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
                <button
                  onClick={() => { onDownload(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-[var(--oryos-input-bg)] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <div className="h-px bg-[var(--oryos-separator)] my-1" />
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-medium text-white mb-2 line-clamp-1">
        {script.title}
      </h3>

      {/* Preview */}
      <p className="text-sm text-[var(--oryos-text-description)] line-clamp-2 mb-4">
        {script.preview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-[var(--oryos-text-disabled)]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(script.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>{script.wordCount} palavras</span>
          </div>
        </div>
        {script.style && (
          <span className="text-xs text-[var(--oryos-accent)]">{script.style}</span>
        )}
      </div>
    </div>
  )
}

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("Todos")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [scripts, setScripts] = useState<Script[]>(mockScripts)
  const [showFilters, setShowFilters] = useState(false)

  const filteredScripts = scripts.filter((script) => {
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.preview.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = selectedPlatform === "Todos" || script.platform === selectedPlatform
    const matchesCategory = selectedCategory === "Todas" || script.category === selectedCategory
    return matchesSearch && matchesPlatform && matchesCategory
  })

  const handleDelete = (id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id))
  }

  const handleCopy = (script: Script) => {
    navigator.clipboard.writeText(script.preview)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[var(--oryos-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Histórico</h1>
        </div>
        <p className="text-[var(--oryos-text-description)]">
          Todos os roteiros que você criou. Visualize, copie ou exporte para usar novamente.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--oryos-text-disabled)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar roteiros..."
              className="pl-12"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("gap-2", showFilters && "border-[var(--oryos-accent)] text-[var(--oryos-accent)]")}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </Button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="flex items-center gap-6 p-4 rounded-xl bg-[var(--oryos-card-bg)] border border-[var(--oryos-card-border)]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--oryos-text-disabled)]" />
              <span className="text-sm text-[var(--oryos-text-description)]">Plataforma:</span>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-colors",
                      selectedPlatform === platform
                        ? "bg-[var(--oryos-accent)] text-black"
                        : "bg-[var(--oryos-input-bg)] text-[var(--oryos-text-description)] hover:text-white"
                    )}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px h-6 bg-[var(--oryos-separator)]" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--oryos-text-description)]">Categoria:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-full text-sm bg-[var(--oryos-input-bg)] text-white border border-[var(--oryos-input-border)] focus:outline-none focus:ring-1 focus:ring-[var(--oryos-accent)]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Scripts grid */}
      {filteredScripts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onView={() => console.log("View", script.id)}
              onCopy={() => handleCopy(script)}
              onDownload={() => console.log("Download", script.id)}
              onDelete={() => handleDelete(script.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--oryos-input-bg)] flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-[var(--oryos-text-disabled)]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {searchQuery || selectedPlatform !== "Todos" || selectedCategory !== "Todas"
              ? "Nenhum roteiro encontrado"
              : "Nenhum roteiro criado"}
          </h3>
          <p className="text-[var(--oryos-text-description)] max-w-sm">
            {searchQuery || selectedPlatform !== "Todos" || selectedCategory !== "Todas"
              ? "Tente ajustar os filtros ou buscar por outro termo."
              : "Crie seu primeiro roteiro na página Create."}
          </p>
        </div>
      )}

      {/* Stats footer */}
      {scripts.length > 0 && (
        <div className="mt-auto pt-6 border-t border-[var(--oryos-separator)]">
          <div className="flex items-center justify-between text-sm text-[var(--oryos-text-description)]">
            <span>{scripts.length} roteiros criados</span>
            <span>{scripts.reduce((acc, s) => acc + s.wordCount, 0).toLocaleString()} palavras totais</span>
          </div>
        </div>
      )}
    </div>
  )
}
