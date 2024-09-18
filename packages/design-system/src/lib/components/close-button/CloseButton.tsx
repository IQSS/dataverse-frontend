import { CloseButton as CloseButtonBS } from 'react-bootstrap'

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ariaLabel?: string
}

export const CloseButton = ({ onClick, ariaLabel = 'Close', ...rest }: CloseButtonProps) => {
  return <CloseButtonBS onClick={onClick} aria-label={ariaLabel} {...rest} />
}
