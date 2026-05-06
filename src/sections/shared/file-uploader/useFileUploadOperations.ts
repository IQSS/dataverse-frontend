import { useCallback, useRef } from 'react'
import { Semaphore } from 'async-mutex'
import { uploadFile } from '@/files/domain/useCases/uploadFile'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { FileUploaderHelper } from './FileUploaderHelper'
import { FileUploadStatus } from './useFileUploadState'
import { UploaderFileRepository } from './types'

export const CONCURRENT_UPLOADS_LIMIT = 6

export interface FileUploadOperationsConfig {
  fileRepository: UploaderFileRepository
  datasetPersistentId: string
  checksumAlgorithm: FixityAlgorithm
  // Callbacks for state updates - compatible with both context and hook-based state
  addFile: (file: File) => void
  updateFile: (
    key: string,
    updates: {
      status?: FileUploadStatus
      progress?: number
      storageId?: string
      checksumValue?: string
    }
  ) => void
  getFileByKey: (key: string) => { status: string } | undefined
  addUploadingToCancel: (key: string, cancel: () => void) => void
  removeUploadingToCancel: (key: string) => void
  onFileSkipped?: (reason: 'ds_store' | 'already_uploaded', file: File) => void
  validateBeforeUpload?: (file: File) => Promise<boolean>
}

export interface FileUploadOperations {
  /** Upload a single file */
  uploadOneFile: (file: File) => Promise<void>
  /** Recursively upload files from a directory */
  addFromDir: (dir: FileSystemDirectoryEntry) => void
  /** Handle dropped items (files or directories), with optional fallback FileList */
  handleDroppedItems: (items: DataTransferItemList, fallbackFiles?: FileList) => void
  /** Retry a failed upload */
  retryUpload: (file: File) => Promise<void>
  /** The semaphore used to limit concurrent uploads */
  semaphore: Semaphore
}

export function useFileUploadOperations(config: FileUploadOperationsConfig): FileUploadOperations {
  const {
    fileRepository,
    datasetPersistentId,
    checksumAlgorithm,
    addFile,
    updateFile,
    getFileByKey,
    addUploadingToCancel,
    removeUploadingToCancel,
    onFileSkipped,
    validateBeforeUpload
  } = config

  const semaphoreRef = useRef(new Semaphore(CONCURRENT_UPLOADS_LIMIT))

  const onFileUploadFailed = useCallback(
    (file: File) => {
      removeUploadingToCancel(FileUploaderHelper.getFileKey(file))
      semaphoreRef.current.release(1)
    },
    [removeUploadingToCancel]
  )

  const onFileUploadFinished = useCallback(
    async (file: File) => {
      const fileKey = FileUploaderHelper.getFileKey(file)

      try {
        if (checksumAlgorithm === FixityAlgorithm.NONE) {
          updateFile(fileKey, { checksumValue: '' })
        } else {
          const checksumValue = await FileUploaderHelper.getChecksum(file, checksumAlgorithm)
          updateFile(fileKey, { checksumValue })
        }
      } finally {
        removeUploadingToCancel(fileKey)
        semaphoreRef.current.release(1)
      }
    },
    [checksumAlgorithm, updateFile, removeUploadingToCancel]
  )

  const uploadOneFile = useCallback(
    async (file: File) => {
      if (FileUploaderHelper.isDS_StoreFile(file)) {
        onFileSkipped?.('ds_store', file)
        return
      }

      const fileKey = FileUploaderHelper.getFileKey(file)
      if (getFileByKey(fileKey)) {
        onFileSkipped?.('already_uploaded', file)
        return
      }

      if (validateBeforeUpload) {
        const shouldContinue = await validateBeforeUpload(file)
        if (!shouldContinue) {
          return
        }
      }

      await semaphoreRef.current.acquire(1)

      addFile(file)

      const cancelFunction = uploadFile(
        fileRepository,
        datasetPersistentId,
        file,
        () => {
          updateFile(fileKey, { status: FileUploadStatus.DONE })
          void onFileUploadFinished(file)
        },
        () => {
          updateFile(fileKey, { status: FileUploadStatus.FAILED })
          onFileUploadFailed(file)
        },
        (now) => updateFile(fileKey, { progress: now }),
        (storageId) => updateFile(fileKey, { storageId })
      )

      addUploadingToCancel(fileKey, cancelFunction)
    },
    [
      fileRepository,
      datasetPersistentId,
      addFile,
      updateFile,
      getFileByKey,
      addUploadingToCancel,
      onFileUploadFinished,
      onFileUploadFailed,
      onFileSkipped,
      validateBeforeUpload
    ]
  )

  const addFromDir = useCallback(
    (dir: FileSystemDirectoryEntry) => {
      const reader = dir.createReader()
      const readNextBatch = () => {
        reader.readEntries((entries) => {
          if (entries.length === 0) {
            return
          }

          entries.forEach((entry) => {
            if (entry.isFile) {
              const fse = entry as FileSystemFileEntry
              fse.file((file) => {
                const fileWithPath = new File([file], file.name, {
                  type: file.type,
                  lastModified: file.lastModified
                })

                Object.defineProperty(fileWithPath, 'webkitRelativePath', {
                  value: entry.fullPath?.startsWith('/')
                    ? entry.fullPath.slice(1)
                    : entry.fullPath ?? '',
                  writable: true
                })

                void uploadOneFile(fileWithPath)
              })
            } else if (entry.isDirectory) {
              addFromDir(entry as FileSystemDirectoryEntry)
            }
          })
          readNextBatch()
        })
      }

      readNextBatch()
    },
    [uploadOneFile]
  )

  const handleDroppedItems = useCallback(
    (items: DataTransferItemList, fallbackFiles?: FileList) => {
      let handledViaEntry = false

      Array.from(items).forEach((item) => {
        const entry = item.webkitGetAsEntry()
        if (entry?.isDirectory) {
          handledViaEntry = true
          addFromDir(entry as FileSystemDirectoryEntry)
        } else if (entry?.isFile) {
          handledViaEntry = true
          const fse = entry as FileSystemFileEntry
          fse.file((file) => {
            const fileWithPath = new File([file], file.name, {
              type: file.type,
              lastModified: file.lastModified
            })
            Object.defineProperty(fileWithPath, 'webkitRelativePath', {
              value: entry.fullPath?.startsWith('/')
                ? entry.fullPath.slice(1)
                : entry.fullPath ?? '',
              writable: true
            })
            void uploadOneFile(fileWithPath)
          })
        }
      })

      if (!handledViaEntry && fallbackFiles && fallbackFiles.length > 0) {
        Array.from(fallbackFiles).forEach((file) => {
          void uploadOneFile(file)
        })
      }
    },
    [addFromDir, uploadOneFile]
  )

  const retryUpload = useCallback(
    async (file: File) => {
      const fileKey = FileUploaderHelper.getFileKey(file)
      updateFile(fileKey, { status: FileUploadStatus.UPLOADING, progress: 0 })

      await semaphoreRef.current.acquire(1)

      const cancelFunction = uploadFile(
        fileRepository,
        datasetPersistentId,
        file,
        () => {
          updateFile(fileKey, { status: FileUploadStatus.DONE })
          void onFileUploadFinished(file)
        },
        () => {
          updateFile(fileKey, { status: FileUploadStatus.FAILED })
          onFileUploadFailed(file)
        },
        (now) => updateFile(fileKey, { progress: now }),
        (storageId) => updateFile(fileKey, { storageId })
      )

      addUploadingToCancel(fileKey, cancelFunction)
    },
    [
      fileRepository,
      datasetPersistentId,
      updateFile,
      addUploadingToCancel,
      onFileUploadFinished,
      onFileUploadFailed
    ]
  )

  return {
    uploadOneFile,
    addFromDir,
    handleDroppedItems,
    retryUpload,
    semaphore: semaphoreRef.current
  }
}
