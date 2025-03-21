import { Card as CardBS } from 'react-bootstrap'

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'top' | 'bottom'
  className?: string
}

export function CardImage({ variant, className, ...rest }: CardImageProps) {
  return <CardBS.Img variant={variant} className={className} {...rest} />
}
