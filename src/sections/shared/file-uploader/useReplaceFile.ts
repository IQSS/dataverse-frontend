import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { UploadedFileDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { replaceFile } from '@/files/domain/useCases/replaceFile'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { UploadedFileDTOMapper } from '@/files/infrastructure/mappers/UploadedFileDTOMapper'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { useFileUploaderContext } from './context/FileUploaderContext'
import { UploadedFile } from './context/fileUploaderReducer'

interface UseReplaceFileReturn {
  submitReplaceFile: (originalFileID: number, file: UploadedFile) => Promise<void>
}

export const useReplaceFile = (fileRepository: FileRepository): UseReplaceFileReturn => {
  const { setIsSaving, setReplaceOperationInfo, removeAllFiles } = useFileUploaderContext()
  const { t } = useTranslation('shared')

  const submitReplaceFile = async (originalFileID: number, newFileInfo: UploadedFile) => {
    setIsSaving(true)

    const newFileDTO: UploadedFileDTO = UploadedFileDTOMapper.toUploadedFileDTO(
      newFileInfo.fileName,
      newFileInfo.description,
      newFileInfo.fileDir,
      newFileInfo.tags,
      newFileInfo.restricted,
      newFileInfo.storageId,
      newFileInfo.checksumValue,
      newFileInfo.checksumAlgorithm,
      newFileInfo.fileType,
      true
    )

    try {
      const newFileIdentifier = await replaceFile(fileRepository, originalFileID, newFileDTO)

      removeAllFiles()
      setReplaceOperationInfo({ success: true, newFileIdentifier })
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        toast.error(formattedError)
      } else {
        toast.error(t('fileUploader.defaultFileReplaceError'))
      }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    submitReplaceFile
  }
}
