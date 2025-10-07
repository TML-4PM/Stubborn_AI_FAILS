
import * as React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  gradient?: 'primary' | 'fail' | 'rainbow' | 'fire' | 'ocean'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

const GradientText = React.forwardRef<any, GradientTextProps>(
  ({ className, gradient = 'primary', as: Component = 'span', children, ...props }, ref) => {
    const gradientClasses = {
      primary: 'bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))]',
      fail: 'bg-[linear-gradient(135deg,hsl(var(--destructive)),hsl(var(--primary)))]',
      rainbow: 'bg-[linear-gradient(135deg,#ec4899,#a855f7,#6366f1)]',
      fire: 'bg-[linear-gradient(135deg,#f97316,#ef4444,#ec4899)]',
      ocean: 'bg-[linear-gradient(135deg,#3b82f6,#14b8a6,#10b981)]'
    }

    return (
      <Component
        ref={ref}
        className={cn(
          "bg-clip-text text-transparent font-bold",
          gradientClasses[gradient],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
GradientText.displayName = "GradientText"

export { GradientText }
