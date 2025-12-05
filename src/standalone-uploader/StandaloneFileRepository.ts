/**
 * Standalone File Repository
 *
 * A simplified file repository for the standalone uploader that doesn't depend on
 * the main app's config.js. It only implements the methods needed for uploading files.
 */

import {
  uploadFile as jsUploadFile,
  addUploadedFilesToDataset,
  UploadedFileDTO
} from '@iqss/dataverse-client-javascript'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'

export class StandaloneFileRepository
  implements Pick<FileRepository, 'uploadFile' | 'addUploadedFiles' | 'getFixityAlgorithm'>
{
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

  // These methods are not used by the standalone uploader but are required by the interface
  // They will throw if called
  getById(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getByDatasetPersistentId(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getByDatasetPersistentIdAndVersion(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getFilesCountInfoByDatasetPersistentId(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getFilesTotalDownloadSizeByDatasetPersistentId(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getMultipleFileDownloadUrl(): never {
    throw new Error('Not implemented in standalone mode')
  }
  getUserPermissionsById(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getDataTablesById(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getFileCitation(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  deleteFile(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  replaceFile(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  restrictFile(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  updateMetadata(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  getVersionSummaries(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  updateTabularTags(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
  updateFileCategories(): Promise<never> {
    throw new Error('Not implemented in standalone mode')
  }
}
