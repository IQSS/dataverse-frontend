import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { addUploadedFiles } from '@/files/domain/useCases/addUploadedFiles'
import { UploadedFileDTOMapper } from '@/files/infrastructure/mappers/UploadedFileDTOMapper'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { useFileUploaderContext } from './context/FileUploaderContext'
import { UploadedFile } from './context/fileUploaderReducer'
import { UploaderFileRepository } from './types'

// WriteError type for error handling - avoid importing from client library due to CommonJS issues with local linked package
interface WriteErrorLike {
  reason?: string
  message?: string
}

interface UseAddUploadedFilesToDatasetReturn {
  submitUploadedFilesToDataset: (uploadedFiles: UploadedFile[]) => Promise<void>
}

export const useAddUploadedFilesToDataset = (
  fileRepository: UploaderFileRepository,
  datasetPersistentId: string
): UseAddUploadedFilesToDatasetReturn => {
  const { setIsSaving, setAddFilesToDatasetOperationInfo, removeAllFiles } =
    useFileUploaderContext()
  const { t } = useTranslation('shared')

  const submitUploadedFilesToDataset = async (uploadedFiles: UploadedFile[]) => {
    setIsSaving(true)

    const uploadedFilesDTO: UploadedFileDTO[] = uploadedFiles.map((newFileInfo) =>
      UploadedFileDTOMapper.toUploadedFileDTO(
        newFileInfo.fileName,
        newFileInfo.description,
        newFileInfo.fileDir,
        newFileInfo.tags,
        newFileInfo.restricted,
        newFileInfo.storageId,
        newFileInfo.checksumValue,
        newFileInfo.checksumAlgorithm,
        newFileInfo.fileType
      )
    )

    try {
      await addUploadedFiles(fileRepository, datasetPersistentId, uploadedFilesDTO)

      removeAllFiles()
      setAddFilesToDatasetOperationInfo({ success: true })
    } catch (err: unknown) {
      // Check if error has reason property (WriteError-like)
      const writeError = err as WriteErrorLike
      if (writeError && (writeError.reason || writeError.message)) {
        // Cast to any to satisfy JSDataverseWriteErrorHandler which expects WriteError
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        const error = new JSDataverseWriteErrorHandler(writeError as any)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        toast.error(formattedError)
      } else {
        toast.error(t('fileUploader.defaultAddUploadedFilesToDatasetError'))
      }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    submitUploadedFilesToDataset
  }
}
