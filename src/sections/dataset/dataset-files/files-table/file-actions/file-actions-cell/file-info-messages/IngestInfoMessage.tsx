import { FileIngest, FileIngestStatus } from '../../../../../../../files/domain/models/File'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import { InfoMessageBox } from './FileInfoMessages'
import { useTranslation } from 'react-i18next'
import { useDataset } from '../../../../../DatasetContext'

interface IngestInfoMessageProps {
  ingest: FileIngest
}
export function IngestInfoMessage({ ingest }: IngestInfoMessageProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()

  if (ingest.status === FileIngestStatus.IN_PROGRESS) {
    return (
      <InfoMessageBox>
        <span>{t('ingest.inProgress')}</span>
      </InfoMessageBox>
    )
  }

  if (ingest.status === FileIngestStatus.ERROR && dataset?.permissions.canUpdateDataset) {
    return (
      <InfoMessageBox>
        <span>
          {t('ingest.error.info')}{' '}
          <QuestionMarkTooltip
            placement="top"
            message={
              <p>
                <a href="#" title={t('ingest.error.tabularIngestGuide')} target="_blank">
                  {t('ingest.error.tabularIngest')}
                </a>{' '}
                {ingest.reportMessage
                  ? t('ingest.error.reportMessage', {
                      reportMessage: ingest.reportMessage
                    })
                  : t('ingest.error.reportMessageDefault')}
              </p>
            }
          />
        </span>
      </InfoMessageBox>
    )
  }

  return <></>
}
