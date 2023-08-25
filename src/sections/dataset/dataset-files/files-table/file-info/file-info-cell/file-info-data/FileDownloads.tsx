import { FilePublishingStatus } from '../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface FileDownloadsProps {
  downloads: number
  publishingStatus: FilePublishingStatus
}
export function FileDownloads({ downloads, publishingStatus }: FileDownloadsProps) {
  const { t } = useTranslation('files')
  if (publishingStatus !== FilePublishingStatus.RELEASED) {
    return <></>
  }

  return (
    <div>
      <span>
        {downloads} {t('table.downloads')}
      </span>
    </div>
  )
}
