import { FilePublishingStatus } from '../../../../../../../files/domain/models/FilePreview'
import { useTranslation } from 'react-i18next'

interface FileDownloadsProps {
  downloadCount: number
  publishingStatus: FilePublishingStatus
}
export function FileDownloads({ downloadCount, publishingStatus }: FileDownloadsProps) {
  const { t } = useTranslation('files')
  if (publishingStatus !== FilePublishingStatus.RELEASED) {
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
