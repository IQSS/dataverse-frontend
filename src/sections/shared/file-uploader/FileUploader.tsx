import { File as FileModel } from '@/files/domain/models/File'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { ReplaceFileReferrer } from '@/sections/replace-file/ReplaceFile'
import { FileUploaderProvider } from './context/FileUploaderContext'
import { useGetFixityAlgorithm } from './useGetFixityAlgorithm'
import { FileUploaderGlobalConfig } from './context/fileUploaderReducer'
import { LoadingConfigSpinner } from './loading-config-spinner/LoadingConfigSpinner'
import FileUploaderPanel from './FileUploaderPanel'

type FileUploaderProps =
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageType: StorageType
      operationType: OperationType.REPLACE_FILE
      originalFile: FileModel
      referrer?: ReplaceFileReferrer
    }
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageType: StorageType
      operationType: OperationType.ADD_FILES_TO_DATASET
      originalFile?: never
      referrer?: never
    }

export type StorageType = 'S3'

export enum OperationType {
  REPLACE_FILE = 'replace-file',
  ADD_FILES_TO_DATASET = 'add-files-to-dataset'
}

// TODO - We need something to tell the user which files have the same contents as other files already in the dataset.
// TODO - When leaving the page or removing an uploaded file from the bottom list, we need to also delete the file from the S3 bucket. We need an API endpoint for this.

export const FileUploader = ({
  fileRepository,
  datasetPersistentId,
  storageType,
  operationType,
  originalFile,
  referrer
}: FileUploaderProps) => {
  const { fixityAlgorithm, isLoadingFixityAlgorithm } = useGetFixityAlgorithm(fileRepository)

  if (isLoadingFixityAlgorithm) {
    return <LoadingConfigSpinner />
  }

  const initialConfig: FileUploaderGlobalConfig =
    operationType === OperationType.REPLACE_FILE
      ? {
          storageType,
          operationType,
          originalFile,
          checksumAlgorithm: fixityAlgorithm
        }
      : {
          storageType,
          operationType,
          checksumAlgorithm: fixityAlgorithm
        }

  return (
    <FileUploaderProvider initialConfig={initialConfig}>
      <FileUploaderPanel
        fileRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        referrer={referrer}
      />
    </FileUploaderProvider>
  )
}
