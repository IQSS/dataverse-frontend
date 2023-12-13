import styles from '../FileInfoCell.module.scss'
import { CopyToClipboardButton } from './copy-to-clipboard-button/CopyToClipboardButton'
import { FileChecksum as FileChecksumModel } from '../../../../../../../files/domain/models/FilePreview'

export function FileChecksum({ checksum }: { checksum: FileChecksumModel | undefined }) {
  if (!checksum) {
    return <></>
  }

  return (
    <div className={styles['checksum-container']}>
      {`${checksum.algorithm}: `}
      <CopyToClipboardButton text={checksum.value} />
    </div>
  )
}
