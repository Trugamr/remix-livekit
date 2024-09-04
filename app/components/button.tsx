import { forwardRef } from 'react'
import { cn } from '~/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button ref={ref} className={cn('bg-gray-100 px-2 py-0.5', className)} {...props}>
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
