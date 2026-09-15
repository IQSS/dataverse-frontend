import { DatasetPublishingStatus } from '../../../../../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'

interface FileDownloadsProps {
  downloadCount: number
  datasetPublishingStatus: DatasetPublishingStatus
}
export function FileDownloads({ downloadCount, datasetPublishingStatus }: FileDownloadsProps) {
  const { t, i18n } = useTranslation('files')
  if (datasetPublishingStatus !== DatasetPublishingStatus.RELEASED) {
    return <></>
  }

  return (
    <div>
      <span>
        {new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language).format(downloadCount)}{' '}
        {t('table.downloads')}
      </span>
    </div>
  )
}
