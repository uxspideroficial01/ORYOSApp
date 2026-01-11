import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[52px] w-full rounded-full border border-[var(--oryos-input-border)] bg-[var(--oryos-input-bg)] px-6 py-4 text-base text-white placeholder:text-[var(--oryos-text-disabled)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oryos-accent)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
