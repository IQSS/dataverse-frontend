import { useReducer, useCallback } from 'react'
import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { FileUploaderHelper } from './FileUploaderHelper'

export interface FileUploadState {
  key: string
  progress: number
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
  storageId?: string
  checksumValue?: string
}

export type FileUploaderState = Record<string, FileUploadState>

type Action =
  | { type: 'ADD_FILE'; file: File }
  | { type: 'UPDATE_FILE'; key: string; updates: Partial<FileUploadState> }
  | { type: 'REMOVE_FILE'; key: string }

const fileUploaderReducer = (state: FileUploaderState, action: Action): FileUploaderState => {
  switch (action.type) {
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
          fileName: FileUploaderHelper.sanitizeFileName(file.name),
          fileDir: file.webkitRelativePath
            ? toDir(FileUploaderHelper.sanitizeFilePath(file.webkitRelativePath))
            : undefined,
          fileType: file.type
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

  const addFile = useCallback((file: File) => dispatch({ type: 'ADD_FILE', file }), [])

  const updateFile = useCallback(
    (key: string, updates: Partial<FileUploadState>) =>
      dispatch({ type: 'UPDATE_FILE', key, updates }),
    []
  )
  const removeFile = useCallback((key: string) => dispatch({ type: 'REMOVE_FILE', key }), [])

  const getFileByKey = (key: string): FileUploadState | undefined => state[key]

  return { state, addFile, updateFile, removeFile, getFileByKey }
}

const toDir = (relativePath: string): string => {
  const parts = relativePath.split('/')
  return parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : ''
}

export const mockFileUploadState: FileUploaderState = {
  'file1.jpg': {
    key: 'file1.jpg',
    progress: 100,
    storageId: 'storage1',
    uploading: false,
    fileSizeString: '2 MB',
    fileSize: 2000000,
    fileLastModified: 1700000000000,
    failed: false,
    done: true,
    removed: false,
    fileName: 'document.pdf',
    fileDir: undefined,
    fileType: 'application/pdf',
    checksumValue: 'abcd1234'
  },
  file2: {
    key: 'file2',
    progress: 50,
    uploading: true,
    fileSizeString: '5 MB',
    fileSize: 5000000,
    fileLastModified: 1700000005000,
    failed: false,
    done: false,
    removed: false,
    fileName: 'image.png',
    fileDir: undefined,
    fileType: 'image/png'
  },
  file3: {
    key: 'file3',
    progress: 10,
    uploading: true,
    fileSizeString: '8 MB',
    fileSize: 8000000,
    fileLastModified: 1700000010000,
    failed: false,
    done: false,
    removed: false,
    fileName: 'video.mp4',
    fileDir: undefined,
    fileType: 'video/mp4'
  },
  file4: {
    key: 'file4',
    progress: 100,
    uploading: false,
    fileSizeString: '1.5 MB',
    fileSize: 1500000,
    fileLastModified: 1700000015000,
    failed: false,
    done: true,
    removed: false,
    fileName: 'spreadsheet.xlsx',
    fileDir: 'documents',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  file5: {
    key: 'file5',
    progress: 0,
    uploading: false,
    fileSizeString: '3 MB',
    fileSize: 3000000,
    fileLastModified: 1700000020000,
    failed: true,
    done: false,
    removed: false,
    fileName: 'presentation.pptx',
    fileDir: 'slides',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  file6: {
    key: 'file6',
    progress: 75,
    uploading: true,
    fileSizeString: '6 MB',
    fileSize: 6000000,
    fileLastModified: 1700000025000,
    failed: false,
    done: false,
    removed: false,
    fileName: 'audio_super_long_name_file.mp3',
    fileDir: '',
    fileType: 'audio/mpeg'
  },
  file7: {
    key: 'file7',
    progress: 100,
    uploading: false,
    fileSizeString: '700 KB',
    fileSize: 700000,
    fileLastModified: 1700000030000,
    failed: false,
    done: true,
    removed: false,
    fileName: 'notes.txt',
    fileDir: 'documents',
    fileType: 'text/plain'
  },
  file8: {
    key: 'file8',
    progress: 20,
    uploading: true,
    fileSizeString: '15 MB',
    fileSize: 15000000,
    fileLastModified: 1700000035000,
    failed: false,
    done: false,
    removed: false,
    fileName: 'compressed.zip',
    fileDir: 'archives',
    fileType: 'application/zip'
  },
  file9: {
    key: 'file9',
    progress: 100,
    uploading: false,
    fileSizeString: '10 MB',
    fileSize: 10000000,
    fileLastModified: 1700000040000,
    failed: false,
    done: true,
    removed: false,
    fileName: 'report.docx',
    fileDir: 'reports',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  file10: {
    key: 'file10',
    progress: 0,
    uploading: false,
    fileSizeString: '12 MB',
    fileSize: 12000000,
    fileLastModified: 1700000045000,
    failed: true,
    done: false,
    removed: false,
    fileName: 'corrupted-file.dat',
    fileDir: 'unknown',
    fileType: 'application/octet-stream'
  }
}
