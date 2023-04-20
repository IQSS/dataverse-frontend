import styles from './RequiredInputSymbol.module.scss'

export const RequiredInputSymbol = () => {
  return (
    <span role="img" aria-label="required-input-symbol" className={styles.asterisk}>
      {' '}
      *
    </span>
  )
}
