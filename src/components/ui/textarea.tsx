import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-[var(--oryos-input-border)] bg-[var(--oryos-input-bg)] px-4 py-3 text-sm text-white placeholder:text-[var(--oryos-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--oryos-accent)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
