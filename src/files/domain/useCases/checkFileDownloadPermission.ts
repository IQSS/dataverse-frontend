import { FileRepository } from '../repositories/FileRepository'
import { File, FileStatus } from '../models/File'

export async function checkFileDownloadPermission(
  fileRepository: FileRepository,
  file: File
): Promise<boolean> {
  if (file.version.status === FileStatus.DEACCESSIONED) {
    return fileRepository.getFileUserPermissionsById(file.id).then((permissions) => {
      return permissions.canEditDataset
    })
  }

  if (!file.access.restricted && !file.isActivelyEmbargoed) {
    return true
  }

  return fileRepository.getFileUserPermissionsById(file.id).then((permissions) => {
    return permissions.canDownloadFile
  })
}
