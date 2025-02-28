import { useReducer, useCallback } from 'react'
import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'

// TODO:ME Use the dto mapper before submitting the files
// TODO:ME When removing a file from the already uploaded files list, should be removed from the file uploader state.

export interface FileUploadState {
  progress: number
  storageId?: string
  progressHidden: boolean
  fileSizeString: string
  fileSize: number
  fileLastModified: number
  failed: boolean
  done: boolean
  removed: boolean
  fileName: string
  fileDir: string
  fileType: string
  key: string
  description?: string
  tags: string[]
  restricted: boolean
  checksumValue?: string
}

type FileUploaderState = Record<string, FileUploadState>

type Action =
  | { type: 'ADD_FILES'; files: File[] }
  | { type: 'UPDATE_FILE'; key: string; updates: Partial<FileUploadState> }
  | { type: 'REMOVE_FILE'; key: string }

const fileUploaderReducer = (state: FileUploaderState, action: Action): FileUploaderState => {
  switch (action.type) {
    case 'ADD_FILES': {
      const newState = { ...state }
      action.files.forEach((file) => {
        const key = file.webkitRelativePath || file.name

        if (!newState[key]) {
          newState[key] = {
            progress: 0,
            progressHidden: true,
            fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
            fileSize: file.size,
            fileLastModified: file.lastModified,
            failed: false,
            done: false,
            removed: false,
            fileName: file.name,
            fileDir: toDir(file.webkitRelativePath),
            fileType: file.type,
            key,
            tags: [],
            restricted: false
          }
        }
      })
      return newState
    }
    case 'UPDATE_FILE': {
      return {
        ...state,
        [action.key]: { ...state[action.key], ...action.updates }
      }
    }
    case 'REMOVE_FILE': {
      const newState = { ...state }
      delete newState[action.key]
      return newState
    }
    default:
      return state
  }
}

export const useFileUploader = () => {
  const [state, dispatch] = useReducer(fileUploaderReducer, {})

  const addFiles = useCallback((files: File[]) => dispatch({ type: 'ADD_FILES', files }), [])

  const updateFile = useCallback(
    (key: string, updates: Partial<FileUploadState>) =>
      dispatch({ type: 'UPDATE_FILE', key, updates }),
    []
  )
  const removeFile = useCallback((key: string) => dispatch({ type: 'REMOVE_FILE', key }), [])

  return { state, addFiles, updateFile, removeFile }
}

// TODO:ME - What if the file has no webkitRelativePath, check if exists when uploading a folder it shows the webkitRelativePath property even if not setting  webkitdirectory property on the input
const toDir = (relativePath: string): string => {
  const parts = relativePath.split('/')
  return parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : ''
}
