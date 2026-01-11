import { User } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-end px-8 py-4 border-b border-[var(--oryos-card-border)]">
      <nav className="flex items-center gap-10 mr-auto">
        <a
          href="/"
          className="text-base text-white hover:text-[var(--oryos-accent)] transition-colors"
        >
          Home
        </a>
        <a
          href="/finetuning"
          className="text-base text-[var(--oryos-text-description)] hover:text-white transition-colors"
        >
          Finetuning
        </a>
        <a
          href="/scripts"
          className="text-base text-[var(--oryos-text-description)] hover:text-white transition-colors"
        >
          Gerar Roteiros
        </a>
        <a
          href="/settings"
          className="text-base text-[var(--oryos-text-description)] hover:text-white transition-colors"
        >
          Settings
        </a>
      </nav>

      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--oryos-card-border)] text-[var(--oryos-text-description)] hover:text-white transition-colors">
        <User size={20} />
      </button>
    </header>
  )
}
