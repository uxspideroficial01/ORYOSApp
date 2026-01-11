import { AlertCircle, RefreshCw } from "lucide-react"

interface Script {
  id: string
  title: string
  status: "generating" | "completed" | "error"
  createdAt: Date
}

interface ScriptGeneratedSectionProps {
  scripts?: Script[]
}

export function ScriptGeneratedSection({ scripts = [] }: ScriptGeneratedSectionProps) {
  const isEmpty = scripts.length === 0

  return (
    <div className="flex flex-col h-full rounded-[32px] border border-[var(--oryos-card-border-light)] bg-black overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-white">Script Generated</h2>
          <p className="text-base text-[var(--oryos-text-description)]">
            Acompanhe o progresso ou volte depois
          </p>
        </div>
        <button className="flex items-center justify-center w-14 h-14 rounded-full hover:bg-[var(--oryos-card-bg)] transition-colors">
          <RefreshCw className="w-5 h-5 text-[var(--oryos-text-description)]" />
        </button>
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-[var(--oryos-separator)]" />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-10">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-white" />
              <span className="text-base font-semibold text-white">
                Nothing here yet...
              </span>
            </div>
            <p className="text-base font-semibold text-white">
              Setting your parameters and start right now.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[var(--oryos-input-bg)] border border-[var(--oryos-input-border)]"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-base text-white">{script.title}</span>
                  <span className="text-sm text-[var(--oryos-text-description)]">
                    {script.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    script.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : script.status === "generating"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {script.status === "completed"
                    ? "Completed"
                    : script.status === "generating"
                    ? "Generating..."
                    : "Error"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
