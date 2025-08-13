import styles from './FileInfoMessages.module.scss'
import { ReactNode } from 'react'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { FilePreview } from '../../../../../../../files/domain/models/FilePreview'
import { IngestInfoMessage } from './IngestInfoMessage'
import { AccessRequestedInfoMessage } from './AccessRequestedInfoMessage'

interface FileInfoMessagesProps {
  file: FilePreview
}

export function FileInfoMessages({ file }: FileInfoMessagesProps) {
  return (
    <>
      <IngestInfoMessage ingest={file.ingest} />
      <AccessRequestedInfoMessage accessRequested={file.access.requested} />
    </>
  )
}

export const InfoMessageBox = ({ children }: { children: ReactNode }) => (
  <div className={styles.box}>
    <InfoCircleFill className={styles.icon} /> {children}
  </div>
)
