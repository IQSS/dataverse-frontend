import { ReactNode, createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import {
  fileUploaderReducer,
  FileUploaderGlobalConfig,
  FileUploadState,
  FileUploaderState,
  FileUploadStatus,
  UploadedFile,
  ReplaceOperationInfo,
  AddFilesToDatasetOperationInfo
} from './fileUploaderReducer'

export interface FileUploaderContextValue {
  fileUploaderState: FileUploaderState
  uploadedFiles: UploadedFile[]
  addFile: (file: File) => void
  updateFile: (key: string, updates: Partial<FileUploadState>) => void
  removeFile: (key: string) => void
  removeAllFiles: () => void
  getFileByKey: (key: string) => FileUploadState | undefined
  setIsSaving: (isSaving: boolean) => void
  addUploadingToCancel: (key: string, cancel: () => void) => void
  removeUploadingToCancel: (key: string) => void
  setReplaceOperationInfo: (replaceOperationInfo: ReplaceOperationInfo) => void
  setAddFilesToDatasetOperationInfo: (
    addFilesToDatasetOperationInfo: AddFilesToDatasetOperationInfo
  ) => void
}

export const FileUploaderContext = createContext<FileUploaderContextValue | undefined>(undefined)

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
    replaceOperationInfo: { success: false, newFileIdentifier: null },
    addFilesToDatasetOperationInfo: { success: false }
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

  const addUploadingToCancel = useCallback((key: string, cancel: () => void) => {
    dispatch({ type: 'ADD_UPLOADING_TO_CANCEL', key, cancel })
  }, [])

  const removeUploadingToCancel = useCallback((key: string) => {
    dispatch({ type: 'REMOVE_UPLOADING_TO_CANCEL', key })
  }, [])

  const setReplaceOperationInfo = useCallback((replaceOperationInfo: ReplaceOperationInfo) => {
    dispatch({ type: 'SET_REPLACE_OPERATION_INFO', replaceOperationInfo })
  }, [])

  const setAddFilesToDatasetOperationInfo = useCallback(
    (addFilesToDatasetOperationInfo: { success: boolean }) => {
      dispatch({ type: 'SET_ADD_FILES_TO_DATASET_OPERATION_INFO', addFilesToDatasetOperationInfo })
    },
    []
  )

  const uploadedDoneAndHashedFiles: UploadedFile[] = useMemo(
    () =>
      Object.values(fileUploaderState.files).filter(
        (file): file is FileUploadState & { storageId: string; checksumValue: string } =>
          file.status === FileUploadStatus.DONE && !!file.storageId && !!file.checksumValue
      ),
    [fileUploaderState.files]
  )

  return (
    <FileUploaderContext.Provider
      value={{
        fileUploaderState,
        uploadedFiles: uploadedDoneAndHashedFiles,
        addFile,
        updateFile,
        removeFile,
        removeAllFiles,
        getFileByKey,
        setIsSaving,
        addUploadingToCancel,
        removeUploadingToCancel,
        setReplaceOperationInfo,
        setAddFilesToDatasetOperationInfo
      }}>
      {children}
    </FileUploaderContext.Provider>
  )
}

export const useFileUploaderContext = (): FileUploaderContextValue => {
  const context = useContext(FileUploaderContext)
  if (!context) {
    /* istanbul ignore next */ throw new Error(
      'useFileUploaderContext must be used within a FileUploaderProvider'
    )
  }
  return context
}
