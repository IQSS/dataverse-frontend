import { FileRepository } from '../repositories/FileRepository'
import { FilePreview } from '../models/FilePreview'

export async function checkFileEditDatasetPermission(
  fileRepository: FileRepository,
  file: FilePreview
): Promise<boolean> {
  return fileRepository.getUserPermissionsById(file.id).then((permissions) => {
    return permissions.canEditDataset
  })
}
