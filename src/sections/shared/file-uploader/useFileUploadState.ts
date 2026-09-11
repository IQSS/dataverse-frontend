import { useState, useMemo, useCallback } from 'react'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { FileUploaderHelper } from './FileUploaderHelper'
import { FileUploadStatus } from './context/fileUploaderReducer'

export { FileUploadStatus } from './context/fileUploaderReducer'

export interface FileUploadState {
  key: string
  progress: number
  status: FileUploadStatus
  fileName: string
  fileDir: string
  fileType: string
  fileSizeString: string
  fileSize: number
  fileLastModified: number
  description: string
  tags: string[]
  restricted: boolean
  storageId?: string
  checksumValue?: string
  checksumAlgorithm: FixityAlgorithm
}

export type UploadedFile = FileUploadState & { storageId: string; checksumValue: string }

export interface FileUploadStateActions {
  files: Record<string, FileUploadState>
  uploadedFiles: UploadedFile[]
  uploadingFilesInProgress: FileUploadState[]
  anyFileUploading: boolean
  uploadingToCancelMap: Map<string, () => void>
  isSaving: boolean
  setIsSaving: (isSaving: boolean) => void
  addFile: (
    file: File,
    checksumAlgorithm: FixityAlgorithm,
    defaults?: Partial<FileUploadState>
  ) => void
  updateFile: (key: string, updates: Partial<FileUploadState>) => void
  removeFile: (key: string) => void
  removeAllFiles: () => void
  getFileByKey: (key: string) => FileUploadState | undefined
  addUploadingToCancel: (key: string, cancel: () => void) => void
  removeUploadingToCancel: (key: string) => void
  reset: () => void
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function useFileUploadState(): FileUploadStateActions {
  const [files, setFiles] = useState<Record<string, FileUploadState>>({})
  const [uploadingToCancelMap, setUploadingToCancelMap] = useState<Map<string, () => void>>(
    new Map()
  )
  const [isSaving, setIsSaving] = useState(false)

  const uploadedFiles = useMemo(() => {
    return Object.values(files).filter(
      (f): f is UploadedFile =>
        f.status === FileUploadStatus.DONE &&
        !!f.storageId &&
        (f.checksumAlgorithm === FixityAlgorithm.NONE || f.checksumValue !== undefined)
    )
  }, [files])

  const uploadingFilesInProgress = useMemo(() => {
    return Object.values(files).filter((file) => file.status !== FileUploadStatus.DONE)
  }, [files])

  const anyFileUploading = useMemo(() => {
    return Object.values(files).some((file) => file.status === FileUploadStatus.UPLOADING)
  }, [files])

  const addFile = useCallback(
    (file: File, checksumAlgorithm: FixityAlgorithm, defaults?: Partial<FileUploadState>) => {
      const fileKey = FileUploaderHelper.getFileKey(file)
      const fileDir = file.webkitRelativePath
        ? file.webkitRelativePath.substring(0, file.webkitRelativePath.lastIndexOf('/'))
        : ''

      setFiles((prev) => {
        if (prev[fileKey]) return prev

        return {
          ...prev,
          [fileKey]: {
            key: fileKey,
            progress: 0,
            status: FileUploadStatus.UPLOADING,
            fileName: file.name,
            fileDir: defaults?.fileDir ?? fileDir,
            fileType: file.type,
            fileSizeString: formatFileSize(file.size),
            fileSize: file.size,
            fileLastModified: file.lastModified,
            description: defaults?.description ?? '',
            tags: defaults?.tags ?? [],
            restricted: defaults?.restricted ?? false,
            checksumAlgorithm
          }
        }
      })
    },
    []
  )

  const updateFile = useCallback((key: string, updates: Partial<FileUploadState>) => {
    setFiles((prev) => {
      if (!prev[key]) return prev
      return {
        ...prev,
        [key]: { ...prev[key], ...updates }
      }
    })
  }, [])

  const removeFile = useCallback((key: string) => {
    setFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[key]
      return newFiles
    })
  }, [])

  const removeAllFiles = useCallback(() => {
    setFiles({})
  }, [])

  const getFileByKey = useCallback((key: string) => files[key], [files])

  const addUploadingToCancel = useCallback((key: string, cancel: () => void) => {
    setUploadingToCancelMap((prev) => new Map(prev).set(key, cancel))
  }, [])

  const removeUploadingToCancel = useCallback((key: string) => {
    setUploadingToCancelMap((prev) => {
      const newMap = new Map(prev)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const reset = useCallback(() => {
    uploadingToCancelMap.forEach((cancel) => cancel())
    setFiles({})
    setUploadingToCancelMap(new Map())
    setIsSaving(false)
  }, [uploadingToCancelMap])

  return {
    files,
    uploadedFiles,
    uploadingFilesInProgress,
    anyFileUploading,
    uploadingToCancelMap,
    isSaving,
    setIsSaving,
    addFile,
    updateFile,
    removeFile,
    removeAllFiles,
    getFileByKey,
    addUploadingToCancel,
    removeUploadingToCancel,
    reset
  }
}
