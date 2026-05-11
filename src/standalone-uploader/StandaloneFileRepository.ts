import {
  uploadFile as jsUploadFile,
  addUploadedFilesToDataset,
  UploadedFileDTO
} from '@iqss/dataverse-client-javascript'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { UploaderFileRepository } from '@/sections/shared/file-uploader/types'

export class StandaloneFileRepository implements UploaderFileRepository {
  private siteUrl: string

  constructor(siteUrl: string) {
    this.siteUrl = siteUrl
  }

  async uploadFile(
    datasetId: string | number,
    fileHolder: { file: File },
    progress: (now: number) => void,
    abortController: AbortController,
    getStorageId: (storageId: string) => void
  ): Promise<void> {
    const storageId = await jsUploadFile.execute(
      datasetId,
      fileHolder.file,
      progress,
      abortController
    )
    getStorageId(storageId)
  }

  async addUploadedFiles(
    datasetId: string | number,
    uploadedFileDTOs: UploadedFileDTO[]
  ): Promise<void> {
    await addUploadedFilesToDataset.execute(datasetId, uploadedFileDTOs)
  }

  async getFixityAlgorithm(): Promise<FixityAlgorithm> {
    try {
      const response = await fetch(`${this.siteUrl}/api/files/fixityAlgorithm`)
      if (!response.ok) {
        console.warn('Could not fetch fixity algorithm, defaulting to MD5')
        return FixityAlgorithm.MD5
      }
      const data = (await response.json()) as { data?: { message?: string } }
      const algorithm: string = data?.data?.message || 'MD5'

      // Map the string to FixityAlgorithm enum
      switch (algorithm.toUpperCase()) {
        case 'MD5':
          return FixityAlgorithm.MD5
        case 'SHA-1':
        case 'SHA1':
          return FixityAlgorithm.SHA1
        case 'SHA-256':
        case 'SHA256':
          return FixityAlgorithm.SHA256
        case 'SHA-512':
        case 'SHA512':
          return FixityAlgorithm.SHA512
        default:
          return FixityAlgorithm.MD5
      }
    } catch (error) {
      console.warn('Error fetching fixity algorithm:', error)
      return FixityAlgorithm.MD5
    }
  }
}
