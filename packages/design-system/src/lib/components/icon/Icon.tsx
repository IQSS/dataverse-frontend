import styles from './Icon.module.scss'

export function Icon({ name }: { name: string }) {
  return <span className={`${styles.icon} ${name}`} role="img" aria-label={name}></span>
}
