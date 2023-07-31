import styles from './FileInfoCell.module.scss'

export function FileDescription({ description }: { description: string | undefined }) {
  if (!description) {
    return <></>
  }
  return <div className={styles['description-container']}>{description}</div>
}
