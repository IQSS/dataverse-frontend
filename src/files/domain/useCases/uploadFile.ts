import { FileRepository } from '../repositories/FileRepository'

/**
 * Minimal repository type for uploadFile.
 * Only requires the uploadFile method.
 */
type UploadFileRepository = Pick<FileRepository, 'uploadFile'>

export function uploadFile(
  fileRepository: UploadFileRepository,
  datasetId: number | string,
  file: File,
  done: () => void,
  failed: () => void,
  progress: (now: number) => void,
  storageIdSetter: (storageId: string) => void
): () => void {
  const controller = new AbortController()

  fileRepository
    .uploadFile(datasetId, { file: file }, progress, controller, storageIdSetter)
    .then(done)
    .catch(failed)

  return () => controller.abort()
}
