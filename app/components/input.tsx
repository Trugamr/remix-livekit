import React from 'react'
import { cn } from '~/lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, ...props }, ref) => (
    <input ref={ref} className={cn('border border-gray-200 px-1 py-0.5', className)} {...props}>
      {children}
    </input>
  ),
)

Input.displayName = 'Input'
