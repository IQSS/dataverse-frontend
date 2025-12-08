/**
 * useFileUploadOperations - Shared hook for file upload operations
 *
 * This hook provides the core upload logic (uploading files, handling directories,
 * computing checksums) that can be shared between the main SPA and standalone uploader.
 */

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
  // Optional callbacks for notifications
  onFileSkipped?: (reason: 'ds_store' | 'already_uploaded', file: File) => void
  onUploadCanceled?: (fileName: string) => void
  // Optional callback for pre-upload validation (e.g., file type check for replace)
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

/**
 * Hook that provides file upload operations.
 * Manages the upload process, directory traversal, and checksum calculation.
 */
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

  // Use a ref to persist semaphore across renders
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
        // Skip checksum calculation if algorithm is NONE
        if (checksumAlgorithm !== FixityAlgorithm.NONE) {
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
      // Skip .DS_Store files
      if (FileUploaderHelper.isDS_StoreFile(file)) {
        onFileSkipped?.('ds_store', file)
        return
      }

      // Check if file already uploaded
      const fileKey = FileUploaderHelper.getFileKey(file)
      if (getFileByKey(fileKey)) {
        onFileSkipped?.('already_uploaded', file)
        return
      }

      // Run optional pre-upload validation
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

      reader.readEntries((entries) => {
        entries.forEach((entry) => {
          if (entry.isFile) {
            const fse = entry as FileSystemFileEntry
            fse.file((file) => {
              const fileWithPath = new File([file], file.name, {
                type: file.type,
                lastModified: file.lastModified
              })

              Object.defineProperty(fileWithPath, 'webkitRelativePath', {
                value: entry.fullPath.startsWith('/') ? entry.fullPath.slice(1) : entry.fullPath,
                writable: true
              })

              void uploadOneFile(fileWithPath)
            })
          } else if (entry.isDirectory) {
            addFromDir(entry as FileSystemDirectoryEntry)
          }
        })
      })
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
            // Create a new File with webkitRelativePath set for consistency
            const fileWithPath = new File([file], file.name, {
              type: file.type,
              lastModified: file.lastModified
            })
            Object.defineProperty(fileWithPath, 'webkitRelativePath', {
              value: entry.fullPath.startsWith('/') ? entry.fullPath.slice(1) : entry.fullPath,
              writable: true
            })
            void uploadOneFile(fileWithPath)
          })
        }
      })

      // Fallback for browsers where webkitGetAsEntry() returns null (e.g., Firefox in some cases)
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
      // Reset status to uploading before retry
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
