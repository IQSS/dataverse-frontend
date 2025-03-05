import { useReducer, useCallback } from 'react'
import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { FileUploaderHelper } from './FileUploaderHelper'

// TODO:ME Use the dto mapper before submitting the files
// TODO:ME When removing a file from the already uploaded files list, should be removed from the file uploader state.

export interface FileUploadState {
  key: string
  progress: number
  storageId?: string
  uploading: boolean
  fileSizeString: string
  fileSize: number
  fileLastModified: number
  failed: boolean
  done: boolean
  removed: boolean
  fileName: string
  fileDir: string | undefined
  fileType: string
  description?: string
  tags: string[]
  restricted: boolean
  checksumValue?: string
}

type FileUploaderState = Record<string, FileUploadState>

type Action =
  | { type: 'ADD_FILES'; files: File[] }
  | { type: 'ADD_FILE'; file: File }
  | { type: 'UPDATE_FILE'; key: string; updates: Partial<FileUploadState> }
  | { type: 'REMOVE_FILE'; key: string }

const fileUploaderReducer = (state: FileUploaderState, action: Action): FileUploaderState => {
  switch (action.type) {
    case 'ADD_FILES': {
      const newState = { ...state }

      const { files } = action

      files.forEach((file) => {
        const fileKey = FileUploaderHelper.getFileKey(file)

        if (!newState[fileKey]) {
          newState[fileKey] = {
            key: fileKey,
            progress: 0,
            uploading: true,
            fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
            fileSize: file.size,
            fileLastModified: file.lastModified,
            failed: false,
            done: false,
            removed: false,
            fileName: file.name,
            fileDir: toDir(file.webkitRelativePath),
            fileType: file.type,
            tags: [],
            restricted: false
          }
        }
      })
      return newState
    }

    case 'ADD_FILE': {
      const { file } = action
      const fileKey = FileUploaderHelper.getFileKey(file)

      if (state[fileKey]) {
        return state
      }

      return {
        ...state,
        [fileKey]: {
          key: fileKey,
          progress: 0,
          uploading: true,
          fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
          fileSize: file.size,
          fileLastModified: file.lastModified,
          failed: false,
          done: false,
          removed: false,
          fileName: file.name,
          fileDir: file.webkitRelativePath ? toDir(file.webkitRelativePath) : undefined,
          fileType: file.type,
          tags: [],
          restricted: false
        }
      }
    }

    case 'UPDATE_FILE': {
      const { key, updates } = action

      if (!state[key]) return state

      return {
        ...state,
        [key]: { ...state[key], ...updates }
      }
    }

    case 'REMOVE_FILE': {
      const { key } = action

      if (!state[key]) return state

      const newState = { ...state }
      delete newState[key]
      return newState
    }

    default:
      return state
  }
}

export const useFileUploader = () => {
  const [state, dispatch] = useReducer(fileUploaderReducer, {})

  const addFiles = useCallback((files: File[]) => dispatch({ type: 'ADD_FILES', files }), [])

  const addFile = useCallback((file: File) => dispatch({ type: 'ADD_FILE', file }), [])

  const updateFile = useCallback(
    (key: string, updates: Partial<FileUploadState>) =>
      dispatch({ type: 'UPDATE_FILE', key, updates }),
    []
  )
  const removeFile = useCallback((key: string) => dispatch({ type: 'REMOVE_FILE', key }), [])

  const getFileByKey = (key: string) => state[key]

  return { state, addFiles, addFile, updateFile, removeFile, getFileByKey }
}

const toDir = (relativePath: string): string => {
  const parts = relativePath.split('/')
  return parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : ''
}
