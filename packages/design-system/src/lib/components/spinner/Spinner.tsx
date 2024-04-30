import { ElementType } from 'react'
import { Spinner as SpinnerBS } from 'react-bootstrap'

type SpinnerVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
type SpinnerAnimations = 'border' | 'grow'

interface SpinnerProps {
  variant?: SpinnerVariant
  animation?: SpinnerAnimations
  size?: 'sm'
  role?: string
  as?: ElementType
}

export const Spinner = ({
  variant = 'primary',
  animation,
  size,
  role = 'status',
  as
}: SpinnerProps) => {
  return (
    <SpinnerBS variant={variant} animation={animation} size={size} role={role} as={as}>
      <span className="visually-hidden">Loading...</span>
    </SpinnerBS>
  )
}
