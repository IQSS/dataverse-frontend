import { ReactNode, createContext, useContext, useReducer, useCallback } from 'react'
import {
  fileUploaderReducer,
  FileUploaderGlobalConfig,
  FileUploadState,
  FileUploaderState
} from './fileUploaderReducer'

interface FileUploaderContextValue {
  fileUploaderState: FileUploaderState
  addFile: (file: File) => void
  updateFile: (key: string, updates: Partial<FileUploadState>) => void
  removeFile: (key: string) => void
  removeAllFiles: () => void
  getFileByKey: (key: string) => FileUploadState | undefined
  setConfig: (config: FileUploaderGlobalConfig) => void
  setIsSaving: (isSaving: boolean) => void
  addUploadingToCancel: (key: string, cancel: () => void) => void
  removeUploadingToCancel: (key: string) => void
}

const FileUploaderContext = createContext<FileUploaderContextValue | undefined>(undefined)

interface FileUploaderProviderProps {
  children: ReactNode
  initialConfig: FileUploaderGlobalConfig
}

export const FileUploaderProvider = ({ children, initialConfig }: FileUploaderProviderProps) => {
  const [fileUploaderState, dispatch] = useReducer(fileUploaderReducer, {
    config: initialConfig,
    files: {},
    uploadingToCancelMap: new Map(),
    isSaving: false,
    isRemovingFiles: false
  })

  const addFile = useCallback((file: File) => dispatch({ type: 'ADD_FILE', file }), [])

  const updateFile = useCallback(
    (key: string, updates: Partial<FileUploadState>) =>
      dispatch({ type: 'UPDATE_FILE', key, updates }),
    []
  )

  const removeFile = useCallback((key: string) => dispatch({ type: 'REMOVE_FILE', key }), [])

  const removeAllFiles = useCallback(() => dispatch({ type: 'REMOVE_ALL_FILES' }), [])

  const getFileByKey = useCallback(
    (key: string) => fileUploaderState.files[key],
    [fileUploaderState.files]
  )

  const setIsSaving = useCallback((isSaving: boolean) => {
    dispatch({ type: 'SET_IS_SAVING', isSaving })
  }, [])

  const setConfig = useCallback((config: FileUploaderGlobalConfig) => {
    dispatch({ type: 'SET_CONFIG', config })
  }, [])

  const addUploadingToCancel = useCallback((key: string, cancel: () => void) => {
    dispatch({ type: 'ADD_UPLOADING_TO_CANCEL', key, cancel })
  }, [])

  const removeUploadingToCancel = useCallback((key: string) => {
    dispatch({ type: 'REMOVE_UPLOADING_TO_CANCEL', key })
  }, [])

  return (
    <FileUploaderContext.Provider
      value={{
        fileUploaderState,
        addFile,
        updateFile,
        removeFile,
        removeAllFiles,
        getFileByKey,
        setConfig,
        setIsSaving,
        addUploadingToCancel,
        removeUploadingToCancel
      }}>
      {children}
    </FileUploaderContext.Provider>
  )
}

export const useFileUploaderContext = (): FileUploaderContextValue => {
  const context = useContext(FileUploaderContext)
  if (!context) {
    throw new Error('useFileUploader must be used within a FileUploaderProvider')
  }
  return context
}
