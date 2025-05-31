
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, position = 'bottom-right', size = 'md', children, ...props }, ref) => {
    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    }

    const sizeClasses = {
      'sm': 'w-12 h-12',
      'md': 'w-14 h-14',
      'lg': 'w-16 h-16'
    }

    return (
      <Button
        ref={ref}
        className={cn(
          "fixed z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
          positionClasses[position],
          sizeClasses[size],
          "bg-gradient-to-r from-fail to-fail-dark hover:from-fail-dark hover:to-fail",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton }
