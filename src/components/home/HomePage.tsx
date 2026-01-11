import { CreateScriptForm } from "./CreateScriptForm"
import { ScriptGeneratedSection } from "./ScriptGeneratedSection"

export function HomePage() {
  return (
    <div className="flex items-center gap-24 px-8 py-12 min-h-screen">
      {/* Left Panel - Create Script Form */}
      <div className="w-[520px] shrink-0">
        <CreateScriptForm />
      </div>

      {/* Right Panel - Script Generated */}
      <div className="flex-1 h-[873px]">
        <ScriptGeneratedSection />
      </div>
    </div>
  )
}
