import styles from './FileInfoCell.module.scss'
import { CopyToClipboardButton } from './copy-to-clipboard-button/CopyToClipboardButton'

export function FileChecksum({ checksum }: { checksum: string | undefined }) {
  if (!checksum) {
    return <></>
  }

  return (
    <div className={styles['checksum-container']}>
      {checksum}
      <CopyToClipboardButton text={checksum} />
    </div>
  )
}
