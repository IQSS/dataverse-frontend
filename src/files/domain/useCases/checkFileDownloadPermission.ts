import { FileRepository } from '../repositories/FileRepository'
import { FilePreview } from '../models/FilePreview'
import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'

export async function checkFileDownloadPermission(
  fileRepository: FileRepository,
  file: FilePreview
): Promise<boolean> {
  if (file.datasetPublishingStatus === DatasetPublishingStatus.DEACCESSIONED) {
    return fileRepository.getUserPermissionsById(file.id).then((permissions) => {
      return permissions.canEditDataset
    })
  }

  const isRestricted = file.access.restricted || file.access.latestVersionRestricted
  if (!isRestricted && !file.metadata.isActivelyEmbargoed) {
    return true
  }

  return fileRepository.getUserPermissionsById(file.id).then((permissions) => {
    return permissions.canDownloadFile
  })
}
