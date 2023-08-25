import styles from './FileInfoMessages.module.scss'
import { ReactNode } from 'react'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { File } from '../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface FileInfoMessagesProps {
  file: File
}
export function FileInfoMessages({ file }: FileInfoMessagesProps) {
  const { t } = useTranslation('files')
  // const { user } = useSession()
  // const ingestInProgress = false // TODO - Implement ingest in progress (ask Guillermo)
  // const ingestProblem = false // TODO - Implement ingest problem (ask Guillermo)
  // const userHasDatasetUpdatePermissions = true // TODO - Implement permissions
  // const ingestReportMessage = 'Ingest report message' // TODO - Implement ingest report message (ask Guillermo)

  return (
    <>
      {/*{ingestInProgress && (*/}
      {/*  <InfoMessageBox>*/}
      {/*    <span>Ingest in progress...</span>*/}
      {/*  </InfoMessageBox>*/}
      {/*)}*/}
      {/*{user && userHasDatasetUpdatePermissions && ingestProblem && (*/}
      {/*  <InfoMessageBox>*/}
      {/*    <span>*/}
      {/*      File available in original format only{' '}*/}
      {/*      <QuestionMarkTooltip placement="top" message={ingestReportMessage} />*/}
      {/*    </span>*/}
      {/*  </InfoMessageBox>*/}
      {/*)}*/}
      {file.access.requested && (
        <InfoMessageBox>{t('requestAccess.accessRequested')}</InfoMessageBox>
      )}
    </>
  )
}

const InfoMessageBox = ({ children }: { children: ReactNode }) => (
  <div className={styles.box}>
    <InfoCircleFill className={styles.icon} /> {children}
  </div>
)