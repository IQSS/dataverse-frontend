import { FileRepository } from '../repositories/FileRepository'
import { File } from '../models/File'

export async function checkFileEditDatasetPermission(
  fileRepository: FileRepository,
  file: File
): Promise<boolean> {
  return fileRepository.getUserPermissionsById(file.id).then((permissions) => {
    return permissions.canEditDataset
  })
}
