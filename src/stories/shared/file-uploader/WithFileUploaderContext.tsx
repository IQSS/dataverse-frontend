import { useEffect, useContext } from 'react'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import {
  FileUploaderContext,
  FileUploaderContextValue,
  FileUploaderProvider
} from '@/sections/shared/file-uploader/context/FileUploaderContext'
import {
  FileUploaderGlobalConfig,
  FileUploadState
} from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { OperationType } from '@/sections/shared/file-uploader/FileUploader'
import { FileUploaderHelper } from '@/sections/shared/file-uploader/FileUploaderHelper'
import { FileMother } from '@tests/component/files/domain/models/FileMother'

interface WithFileUploaderContextProps {
  children: React.ReactNode
  mode: OperationType
  filesToAdd?: {
    file: File
    updates?: Partial<FileUploadState>
  }[]
}

export const WithFileUploaderContext = ({
  children,
  mode,
  filesToAdd = []
}: WithFileUploaderContextProps) => {
  const initialConfig: FileUploaderGlobalConfig =
    mode === OperationType.REPLACE_FILE
      ? {
          storageType: 'S3',
          operationType: OperationType.REPLACE_FILE,
          originalFile: FileMother.createRealistic(),
          checksumAlgorithm: FixityAlgorithm.MD5
        }
      : {
          storageType: 'S3',
          operationType: OperationType.ADD_FILES_TO_DATASET,
          checksumAlgorithm: FixityAlgorithm.MD5
        }
  return (
    <FileUploaderProvider initialConfig={initialConfig}>
      <FileUploaderStateInitializer filesToAdd={filesToAdd} />
      {children}
    </FileUploaderProvider>
  )
}

const FileUploaderStateInitializer = ({
  filesToAdd = []
}: {
  filesToAdd?: {
    file: File
    updates?: Partial<FileUploadState>
  }[]
}) => {
  const { addFile, updateFile } = useContext(FileUploaderContext) as FileUploaderContextValue

  useEffect(() => {
    filesToAdd.forEach(({ file, updates }) => {
      addFile(file)
      if (updates) {
        updateFile(FileUploaderHelper.getFileKey(file), updates)
      }
    })
  }, [filesToAdd, addFile, updateFile])

  return null
}
