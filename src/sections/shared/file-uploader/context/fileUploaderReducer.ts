import { File as FileModel } from '@/files/domain/models/File'
import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { FileUploaderHelper } from '../FileUploaderHelper'
import { OperationType, StorageType } from '../FileUploader'

export interface FileUploaderState {
  config: FileUploaderGlobalConfig
  files: FileUploadInputState
  uploadingToCancelMap: Map<string, () => void>
  isSaving: boolean
  isRemovingFiles: boolean
  replaceOperationInfo: ReplaceOperationInfo
  addFilesToDatasetOperationInfo: AddFilesToDatasetOperationInfo
}
export type FileUploadInputState = Record<string, FileUploadState>

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
  storageId?: string
  checksumValue?: string
  checksumAlgorithm: FixityAlgorithm
}

export type UploadedFile = FileUploadState & { storageId: string; checksumValue: string }

export enum FileUploadStatus {
  UPLOADING = 'uploading',
  DONE = 'done',
  FAILED = 'failed',
  REMOVED = 'removed'
}

export type FileUploaderGlobalConfig =
  | {
      checksumAlgorithm: FixityAlgorithm
      storageType: StorageType
      operationType: OperationType.REPLACE_FILE
      originalFile: FileModel
    }
  | {
      checksumAlgorithm: FixityAlgorithm
      storageType: StorageType
      operationType: OperationType.ADD_FILES_TO_DATASET
      originalFile?: never
    }

export type ReplaceOperationInfo = {
  success: boolean
  newFileIdentifier: number | null
}

export type AddFilesToDatasetOperationInfo = {
  success: boolean
}

type Action =
  | { type: 'ADD_FILE'; file: File }
  | { type: 'UPDATE_FILE'; key: string; updates: Partial<FileUploadState> }
  | { type: 'REMOVE_FILE'; key: string }
  | { type: 'REMOVE_ALL_FILES' }
  | { type: 'SET_CONFIG'; config: FileUploaderGlobalConfig }
  | { type: 'SET_IS_SAVING'; isSaving: boolean }
  | { type: 'SET_REPLACE_OPERATION_INFO'; replaceOperationInfo: ReplaceOperationInfo }
  | {
      type: 'SET_ADD_FILES_TO_DATASET_OPERATION_INFO'
      addFilesToDatasetOperationInfo: AddFilesToDatasetOperationInfo
    }
  | { type: 'ADD_UPLOADING_TO_CANCEL'; key: string; cancel: () => void }
  | { type: 'REMOVE_UPLOADING_TO_CANCEL'; key: string }

export const fileUploaderReducer = (
  state: FileUploaderState,
  action: Action
): FileUploaderState => {
  switch (action.type) {
    case 'SET_CONFIG': {
      return { ...state, config: action.config }
    }

    case 'ADD_FILE': {
      const { file } = action
      const fileKey = FileUploaderHelper.getFileKey(file)

      if (state.files[fileKey]) {
        return state
      }

      return {
        ...state,
        files: {
          ...state.files,
          [fileKey]: {
            key: fileKey,
            progress: 0,
            status: FileUploadStatus.UPLOADING,
            fileName: FileUploaderHelper.sanitizeFileName(file.name),
            fileDir: file.webkitRelativePath
              ? toDir(FileUploaderHelper.sanitizeFilePath(file.webkitRelativePath))
              : state.config.originalFile?.metadata.directory ?? '',
            fileType: file.type,
            fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
            fileSize: file.size,
            fileLastModified: file.lastModified,
            checksumAlgorithm: state.config.checksumAlgorithm,
            description: state.config.originalFile?.metadata.description ?? ''
          }
        }
      }
    }

    case 'UPDATE_FILE': {
      const { key, updates } = action

      if (!state.files[key]) return state

      return {
        ...state,
        files: {
          ...state.files,
          [key]: { ...state.files[key], ...updates }
        }
      }
    }

    case 'REMOVE_FILE': {
      const { key } = action

      if (!state.files[key]) return state

      const newFiles = { ...state.files }
      delete newFiles[key]
      return { ...state, files: newFiles }
    }

    case 'REMOVE_ALL_FILES': {
      return { ...state, files: {} }
    }

    case 'SET_IS_SAVING': {
      return { ...state, isSaving: action.isSaving }
    }

    case 'ADD_UPLOADING_TO_CANCEL': {
      const { key, cancel } = action
      state.uploadingToCancelMap.set(key, cancel)
      return state
    }

    case 'REMOVE_UPLOADING_TO_CANCEL': {
      const { key } = action
      state.uploadingToCancelMap.delete(key)
      return state
    }

    case 'SET_REPLACE_OPERATION_INFO': {
      return { ...state, replaceOperationInfo: action.replaceOperationInfo }
    }

    case 'SET_ADD_FILES_TO_DATASET_OPERATION_INFO': {
      return { ...state, addFilesToDatasetOperationInfo: action.addFilesToDatasetOperationInfo }
    }

    default:
      return state
  }
}

const toDir = (relativePath: string): string => {
  const parts = relativePath.split('/')
  return parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : ''
}
