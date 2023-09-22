import { FileStatus } from '../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface FileDownloadsProps {
  downloads: number
  status: FileStatus
}
export function FileDownloads({ downloads, status }: FileDownloadsProps) {
  const { t } = useTranslation('files')
  if (status !== FileStatus.RELEASED) {
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
