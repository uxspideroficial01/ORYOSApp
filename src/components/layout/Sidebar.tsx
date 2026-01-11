import { cn } from "@/lib/utils"
import { Sun } from "lucide-react"

interface NavItem {
  label: string
  href: string
  active?: boolean
}

const navItems: NavItem[] = [
  { label: "Create", href: "/", active: true },
  { label: "Cloning", href: "/cloning" },
  { label: "History", href: "/history" },
  { label: "Settings", href: "/settings" },
]

export function Sidebar() {
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
            <a
              href={item.href}
              className={cn(
                "text-base transition-colors",
                item.active
                  ? "text-white font-medium"
                  : "text-[var(--oryos-text-muted)] hover:text-white"
              )}
            >
              {item.label}
            </a>
            {index < navItems.length - 1 && (
              <div className="w-[26px] h-px bg-[var(--oryos-separator-dark)]" />
            )}
          </div>
        ))}

        <div className="w-[26px] h-px bg-[var(--oryos-separator-dark)]" />

        {/* PRO Badge */}
        <a
          href="/upgrade"
          className="text-base font-bold text-[var(--oryos-text-muted)] hover:text-white transition-colors"
        >
          PRO
        </a>
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
