interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--oryos-accent)]/10 via-transparent to-transparent" />

        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[var(--oryos-accent)]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--oryos-accent)]/5 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <span className="text-6xl font-bold text-white">ORYOS</span>
          </div>
          <p className="text-xl text-[var(--oryos-text-description)] max-w-md">
            Crie roteiros incriveis para suas redes sociais com o poder da inteligencia artificial.
          </p>

          {/* Features list */}
          <div className="mt-12 flex flex-col gap-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--oryos-accent)]" />
              <span className="text-[var(--oryos-text-description)]">Geracao de roteiros em segundos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--oryos-accent)]" />
              <span className="text-[var(--oryos-text-description)]">Clone seu estilo de conteudo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--oryos-accent)]" />
              <span className="text-[var(--oryos-text-description)]">DeepResearch para conteudo relevante</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-bold text-white">ORYOS</span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-base text-[var(--oryos-text-description)]">{subtitle}</p>
          </div>

          {/* Form content */}
          {children}
        </div>
      </div>
    </div>
  )
}
