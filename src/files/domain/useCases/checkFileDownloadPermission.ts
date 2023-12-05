import { FileRepository } from '../repositories/FileRepository'
import { File, FilePublishingStatus } from '../models/File'

// TODO: remove async when ready and then remove eslint-disable
// eslint-disable-next-line @typescript-eslint/require-await
export async function checkFileDownloadPermission(
  fileRepository: FileRepository,
  file: File
): Promise<boolean> {
  if (file.version.publishingStatus === FilePublishingStatus.DEACCESSIONED) {
    return file.userPermissions?.canEditDataset || false
  }

  const isRestricted = file.access.restricted || file.access.latestVersionRestricted
  if (!isRestricted && !file.isActivelyEmbargoed) {
    return true
  }

  return file.userPermissions?.canDownloadFile || false
}
