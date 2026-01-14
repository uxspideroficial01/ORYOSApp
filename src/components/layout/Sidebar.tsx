import { cn } from "@/lib/utils"
import { Sun } from "lucide-react"

interface NavItem {
  label: string
  id: string
}

const navItems: NavItem[] = [
  { label: "Create", id: "home" },
  { label: "Cloning", id: "cloning" },
  { label: "Analytics", id: "analytics" },
  { label: "Styles", id: "styles" },
  { label: "History", id: "history" },
  { label: "Settings", id: "settings" },
]

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex flex-col justify-center h-full w-[120px] py-8 px-5">
      {/* Logo */}
      <div className="mb-auto">
        <span className="text-base font-bold text-[var(--oryos-text-muted)]">
          Oryos
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item, index) => (
          <div key={item.label} className="flex flex-col gap-3">
            <button
              onClick={() => onNavigate(item.id)}
              className={cn(
                "text-base transition-colors text-left",
                activePage === item.id
                  ? "text-white font-medium"
                  : "text-[var(--oryos-text-muted)] hover:text-white"
              )}
            >
              {item.label}
            </button>
            {index < navItems.length - 1 && (
              <div className="w-[26px] h-px bg-[var(--oryos-separator-dark)]" />
            )}
          </div>
        ))}

        <div className="w-[26px] h-px bg-[var(--oryos-separator-dark)]" />

        {/* PRO Badge */}
        <button
          onClick={() => onNavigate("upgrade")}
          className="text-base font-bold text-[var(--oryos-text-muted)] hover:text-white transition-colors text-left"
        >
          PRO
        </button>
      </nav>

      {/* Theme Toggle */}
      <div className="mt-auto pt-8">
        <button className="text-white hover:text-[var(--oryos-accent)] transition-colors">
          <Sun size={18} />
        </button>
      </div>
    </aside>
  )
}
