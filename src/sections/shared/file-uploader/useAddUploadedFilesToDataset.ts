import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { UploadedFileDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { addUploadedFiles } from '@/files/domain/useCases/addUploadedFiles'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { UploadedFileDTOMapper } from '@/files/infrastructure/mappers/UploadedFileDTOMapper'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { useFileUploaderContext } from './context/FileUploaderContext'
import { UploadedFile } from './context/fileUploaderReducer'

interface UseAddUploadedFilesToDatasetReturn {
  submitUploadedFilesToDataset: (uploadedFiles: UploadedFile[]) => Promise<void>
}

export const useAddUploadedFilesToDataset = (
  fileRepository: FileRepository,
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
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        toast.error(formattedError)
      } else {
        toast.error(t('defaultAddUploadedFilesToDatasetError'))
      }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    submitUploadedFilesToDataset
  }
}
