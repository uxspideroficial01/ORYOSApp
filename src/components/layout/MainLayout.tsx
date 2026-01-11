import { Sidebar } from "./Sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  activePage: string
  onNavigate: (page: string) => void
}

export function MainLayout({ children, activePage, onNavigate }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
