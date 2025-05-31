
import * as React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  gradient?: 'primary' | 'fail' | 'rainbow' | 'fire' | 'ocean'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

const GradientText = React.forwardRef<any, GradientTextProps>(
  ({ className, gradient = 'primary', as: Component = 'span', children, ...props }, ref) => {
    const gradientClasses = {
      primary: 'bg-gradient-to-r from-primary to-primary/70',
      fail: 'bg-gradient-to-r from-fail to-fail-dark',
      rainbow: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
      fire: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
      ocean: 'bg-gradient-to-r from-blue-500 via-teal-500 to-green-500'
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
