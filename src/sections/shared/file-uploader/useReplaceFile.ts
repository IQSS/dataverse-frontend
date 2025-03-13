import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { UploadedFileDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { replaceFile } from '@/files/domain/useCases/replaceFile'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
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

    const newFileDTO: UploadedFileDTO = {
      storageId: newFileInfo.storageId,
      checksumValue: newFileInfo.checksumValue,
      checksumType: newFileInfo.checksumAlgorithm,
      fileName: newFileInfo.fileName,
      description: newFileInfo.description,
      directoryLabel: newFileInfo.fileDir,
      // categories?: string[];
      // restrict?: boolean;
      mimeType: newFileInfo.fileType === '' ? 'application/octet-stream' : newFileInfo.fileType, // some browsers (e.g., chromium for .java files) fail to detect the mime type for some files and leave the fileType as an empty string, we use the default value 'application/octet-stream' in that case
      forceReplace: true
    }

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
