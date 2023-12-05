import { FileRepository } from '../repositories/FileRepository'
import { File } from '../models/File'
// TODO: remove async when ready and then remove eslint-disable
// eslint-disable-next-line @typescript-eslint/require-await
export async function checkFileEditDatasetPermission(
  fileRepository: FileRepository,
  file: File
): Promise<boolean> {
  return file.userPermissions?.canEditDataset || false
}
