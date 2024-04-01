import { DatasetPublishingStatus } from '../../../../../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'

interface FileDownloadsProps {
  downloadCount: number
  datasetPublishingStatus: DatasetPublishingStatus
}
export function FileDownloads({ downloadCount, datasetPublishingStatus }: FileDownloadsProps) {
  const { t } = useTranslation('files')
  if (datasetPublishingStatus !== DatasetPublishingStatus.RELEASED) {
    return <></>
  }

  return (
    <div>
      <span>
        {downloadCount} {t('table.downloads')}
      </span>
    </div>
  )
}
