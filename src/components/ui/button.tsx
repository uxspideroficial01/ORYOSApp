import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oryos-accent)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white text-[var(--oryos-card-bg)] shadow hover:bg-white/90 hover:scale-[1.02]",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-[var(--oryos-card-border)] bg-transparent shadow-sm hover:bg-[var(--oryos-card-bg)] hover:text-white",
        secondary:
          "bg-white text-[var(--oryos-text-description)] shadow-sm hover:bg-white/90",
        ghost: "hover:bg-[var(--oryos-card-bg)] hover:text-white",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-3 rounded-full",
        sm: "h-9 rounded-full px-4 text-sm",
        lg: "h-14 rounded-full px-10",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
