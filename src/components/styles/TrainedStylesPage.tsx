import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Wand2,
  Plus,
  Search,
  MoreVertical,
  Play,
  Trash2,
  Edit3,
  Copy,
  Clock,
  Video,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TrainedStyle {
  id: string
  name: string
  videosCount: number
  createdAt: string
  lastUsed: string
  status: "ready" | "training" | "error"
  thumbnail?: string
}

const mockStyles: TrainedStyle[] = [
  {
    id: "1",
    name: "Estilo Vlogs",
    videosCount: 5,
    createdAt: "2024-01-10",
    lastUsed: "2024-01-15",
    status: "ready",
    thumbnail: "https://picsum.photos/seed/style1/200/120",
  },
  {
    id: "2",
    name: "Tutorial Técnico",
    videosCount: 4,
    createdAt: "2024-01-08",
    lastUsed: "2024-01-14",
    status: "ready",
    thumbnail: "https://picsum.photos/seed/style2/200/120",
  },
  {
    id: "3",
    name: "Review de Produtos",
    videosCount: 6,
    createdAt: "2024-01-12",
    lastUsed: "Nunca",
    status: "training",
  },
]

interface StyleCardProps {
  style: TrainedStyle
  onUse: () => void
  onDelete: () => void
  onEdit: () => void
  onDuplicate: () => void
}

function StyleCard({ style, onUse, onDelete, onEdit, onDuplicate }: StyleCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="rounded-2xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] overflow-hidden group hover:border-[var(--oryos-card-border-light)] transition-colors">
      {/* Thumbnail */}
      <div className="aspect-video bg-[var(--oryos-input-bg)] relative">
        {style.thumbnail ? (
          <img
            src={style.thumbnail}
            alt={style.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wand2 className="w-12 h-12 text-[var(--oryos-text-disabled)]" />
          </div>
        )}

        {/* Status badge */}
        <div className={cn(
          "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium",
          style.status === "ready" && "bg-[var(--oryos-accent)]/20 text-[var(--oryos-accent)]",
          style.status === "training" && "bg-yellow-500/20 text-yellow-400",
          style.status === "error" && "bg-red-500/20 text-red-400"
        )}>
          {style.status === "ready" && "Pronto"}
          {style.status === "training" && "Treinando..."}
          {style.status === "error" && "Erro"}
        </div>

        {/* Menu button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg bg-black/60 text-white/80 hover:bg-black/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-[var(--oryos-card-border)] bg-[var(--oryos-card-bg)] py-1 shadow-xl">
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-[var(--oryos-input-bg)] transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => { onDuplicate(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-[var(--oryos-input-bg)] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplicar
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

        {/* Use button overlay */}
        {style.status === "ready" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={onUse} size="sm" className="gap-2">
              <Play className="w-4 h-4" />
              Usar estilo
            </Button>
          </div>
        )}

        {/* Training progress */}
        {style.status === "training" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--oryos-card-border)]">
            <div className="h-full w-2/3 bg-yellow-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-base font-medium text-white mb-2">{style.name}</h3>

        <div className="flex items-center gap-4 text-sm text-[var(--oryos-text-description)]">
          <div className="flex items-center gap-1.5">
            <Video className="w-4 h-4" />
            <span>{style.videosCount} vídeos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{style.lastUsed === "Nunca" ? "Nunca usado" : `Usado ${style.lastUsed}`}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TrainedStylesPageProps {
  onNavigateToCloning?: () => void
}

export function TrainedStylesPage({ onNavigateToCloning }: TrainedStylesPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [styles, setStyles] = useState<TrainedStyle[]>(mockStyles)

  const filteredStyles = styles.filter((style) =>
    style.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setStyles((prev) => prev.filter((s) => s.id !== id))
  }

  const handleDuplicate = (style: TrainedStyle) => {
    const newStyle: TrainedStyle = {
      ...style,
      id: Date.now().toString(),
      name: `${style.name} (cópia)`,
      lastUsed: "Nunca",
    }
    setStyles((prev) => [...prev, newStyle])
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--oryos-accent)]/20 to-[var(--oryos-accent)]/5 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--oryos-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Estilos Treinados</h1>
        </div>
        <p className="text-[var(--oryos-text-description)]">
          Gerencie seus estilos de conteúdo clonados. Use-os para gerar roteiros com seu tom de voz.
        </p>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--oryos-text-disabled)]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar estilos..."
            className="pl-12"
          />
        </div>
        <Button onClick={onNavigateToCloning} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo estilo
        </Button>
      </div>

      {/* Styles grid */}
      {filteredStyles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStyles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              onUse={() => console.log("Use style", style.id)}
              onDelete={() => handleDelete(style.id)}
              onEdit={() => console.log("Edit style", style.id)}
              onDuplicate={() => handleDuplicate(style)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--oryos-input-bg)] flex items-center justify-center mb-4">
            <Wand2 className="w-8 h-8 text-[var(--oryos-text-disabled)]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {searchQuery ? "Nenhum estilo encontrado" : "Nenhum estilo criado"}
          </h3>
          <p className="text-[var(--oryos-text-description)] max-w-sm mb-6">
            {searchQuery
              ? "Tente buscar por outro termo."
              : "Crie seu primeiro estilo de cloning para gerar roteiros com seu tom de voz."}
          </p>
          {!searchQuery && (
            <Button onClick={onNavigateToCloning} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar estilo
            </Button>
          )}
        </div>
      )}

      {/* Usage stats */}
      {filteredStyles.length > 0 && (
        <div className="mt-auto pt-6 border-t border-[var(--oryos-separator)]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--oryos-text-description)]">
              {styles.length} de 3 estilos usados (Plano gratuito)
            </span>
            <Button variant="link" className="text-[var(--oryos-accent)] p-0 h-auto">
              Fazer upgrade para mais estilos
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
