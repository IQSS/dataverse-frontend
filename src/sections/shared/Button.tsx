import styles from './Button.module.scss'

interface ButtonProps {
  secondary?: boolean
  size?: 'small' | 'medium' | 'large'
  label: string
  onClick?: () => void
}

export const Button = ({ secondary = false, size = 'medium', label, ...props }: ButtonProps) => {
  const mode = secondary ? 'secondary' : 'primary'
  return (
    <button type="button" className={[styles[mode], styles[size]].join(' ')} {...props}>
      {label}
    </button>
  )
}
