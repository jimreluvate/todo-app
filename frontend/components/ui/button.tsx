import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variants
          {
            'primary': 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900',
            'secondary': 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
            'ghost': 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
          }[variant],
          
          // Sizes
          {
            'sm': 'px-3 py-1.5 text-sm',
            'md': 'px-4 py-2 text-sm',
            'lg': 'px-6 py-3 text-base',
          }[size],
          
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span>{children}</span>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
