import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  className?: string
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, placeholder, options, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const selectedOption = options.find((opt) => opt.value === value)

    return (
      <div ref={ref} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-[52px] w-full items-center justify-between rounded-full border border-[var(--oryos-input-border)] bg-[var(--oryos-input-bg)] px-6 py-4 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oryos-accent)] transition-colors"
        >
          <span className={selectedOption ? "text-white" : "text-[var(--oryos-text-description)]"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={cn("h-6 w-6 text-white transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-3xl border border-[var(--oryos-input-border)] bg-[var(--oryos-card-bg)] py-2 shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onValueChange?.(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-6 py-3 text-left text-base transition-colors hover:bg-[var(--oryos-input-border)]",
                  value === option.value
                    ? "text-white"
                    : "text-[var(--oryos-text-description)]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
