import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex-1 px-4 py-2.5 border rounded-md transition-all duration-150',
          'bg-white border-gray-200 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'focus:ring-gray-400 focus:border-gray-400 focus:placeholder-gray-400',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'focus:ring-gray-400 focus:border-gray-400',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
