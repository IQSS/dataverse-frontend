import { FileIngest, FileIngestStatus } from '../../../../../../../files/domain/models/File'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import { InfoMessageBox } from './FileInfoMessages'
import { useTranslation } from 'react-i18next'

interface IngestInfoMessageProps {
  ingest: FileIngest
}
export function IngestInfoMessage({ ingest }: IngestInfoMessageProps) {
  const { t } = useTranslation('files')
  const userHasDatasetUpdatePermissions = true // TODO - Implement dataset permissions

  if (ingest.status === FileIngestStatus.IN_PROGRESS) {
    return (
      <InfoMessageBox>
        <span>Ingest in progress...</span>
      </InfoMessageBox>
    )
  }

  if (ingest.status === FileIngestStatus.ERROR && userHasDatasetUpdatePermissions) {
    return (
      <InfoMessageBox>
        <span>
          File available in original format only{' '}
          <QuestionMarkTooltip
            placement="top"
            message={
              <p>
                <a href="#" title="Tabular Data Files - Dataverse User Guide" target="_blank">
                  Tabular ingest
                </a>{' '}
                was unsuccessful.{' '}
                {ingest.reportMessage
                  ? ingest.reportMessage
                  : 'Ingest failed. No further information is available.'}
              </p>
            }
          />
        </span>
      </InfoMessageBox>
    )
  }

  return null
}
