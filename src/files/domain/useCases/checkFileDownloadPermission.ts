import { FileRepository } from '../repositories/FileRepository'
import { File, FilePublishingStatus } from '../models/File'

export async function checkFileDownloadPermission(
  fileRepository: FileRepository,
  file: File
): Promise<boolean> {
  if (file.version.publishingStatus === FilePublishingStatus.DEACCESSIONED) {
    return fileRepository.getFileUserPermissionsById(file.id).then((permissions) => {
      return permissions.canEditDataset
    })
  }

  const isRestricted = file.access.restricted || file.access.latestVersionRestricted
  if (!isRestricted && !file.isActivelyEmbargoed) {
    return true
  }

  return fileRepository.getFileUserPermissionsById(file.id).then((permissions) => {
    return permissions.canDownloadFile
  })
}
