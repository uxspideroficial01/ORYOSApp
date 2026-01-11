import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { FormatCard } from "./FormatCard"
import { Wand2 } from "lucide-react"

const categories = [
  { value: "tecnologia", label: "Tecnologia" },
  { value: "marketing", label: "Marketing" },
  { value: "educacao", label: "Educacao" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "financas", label: "Financas" },
  { value: "saude", label: "Saude" },
]

const creators = [
  { value: "mkbhd", label: "MKBHD" },
  { value: "uxspider", label: "@uxspider" },
  { value: "fireship", label: "Fireship" },
  { value: "custom", label: "Personalizado" },
]

export function CreateScriptForm() {
  const [subject, setSubject] = useState("")
  const [deepResearch, setDeepResearch] = useState(false)
  const [format, setFormat] = useState<"short" | "long">("short")
  const [category, setCategory] = useState("")
  const [creator, setCreator] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ subject, deepResearch, format, category, creator })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Subject Input */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-base text-white">Assunto</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Por exemplo... O que e IA?"
          />
        </div>

        {/* Deep Research Toggle */}
        <div className="flex items-center gap-2">
          <Switch checked={deepResearch} onCheckedChange={setDeepResearch} />
          <span className="text-sm text-[var(--oryos-text-description)]">
            Ativar DeepResearch
          </span>
        </div>
      </div>

      {/* Format Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-base text-white">Formato do Roteiro</label>
        <div className="grid grid-cols-2 gap-6">
          <FormatCard
            type="short"
            selected={format === "short"}
            onClick={() => setFormat("short")}
          />
          <FormatCard
            type="long"
            selected={format === "long"}
            onClick={() => setFormat("long")}
          />
        </div>
      </div>

      {/* Category Select */}
      <div className="flex flex-col gap-2">
        <label className="text-base text-white">Categoria</label>
        <Select
          value={category}
          onValueChange={setCategory}
          placeholder="Tecnologia"
          options={categories}
        />
      </div>

      {/* Creator Reference Select */}
      <div className="flex flex-col gap-2">
        <label className="text-base text-white">Creator de referencia</label>
        <Select
          value={creator}
          onValueChange={setCreator}
          placeholder="MKBHD"
          options={creators}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-6 pt-4">
        <Button type="submit" className="w-full">
          <Wand2 className="w-6 h-6" />
          Gerar Roteiro
        </Button>

        <div className="w-full h-px bg-[var(--oryos-card-border)]" />

        <Button
          type="button"
          variant="secondary"
          className="w-full relative rounded-2xl"
          disabled
        >
          <span className="text-[var(--oryos-text-description)]">
            Clonar meu Estilo
          </span>
          <div className="absolute right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--oryos-accent-orange-bg)]">
            <span className="text-sm font-bold text-[var(--oryos-accent-orange)]">
              Disponivel no plano ULTRA
            </span>
          </div>
        </Button>
      </div>
    </form>
  )
}
