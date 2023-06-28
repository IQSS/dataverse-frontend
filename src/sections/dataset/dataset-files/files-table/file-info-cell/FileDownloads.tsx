import { FileStatus } from '../../../../../files/domain/models/File'

interface FileDownloadsProps {
  downloads: number
  status: FileStatus
}
export function FileDownloads({ downloads, status }: FileDownloadsProps) {
  if (status !== FileStatus.RELEASED) {
    return <></>
  }

  return (
    <div>
      <span>{downloads} Downloads</span>
    </div>
  )
}
