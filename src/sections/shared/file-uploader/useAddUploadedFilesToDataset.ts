import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { UploadedFileDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { addUploadedFiles } from '@/files/domain/useCases/addUploadedFiles'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { UploadedFileInfo } from '../file-uploader-panel/uploaded-files-list/UploadedFileInfo'
import { useFileUploaderContext } from './context/FileUploaderContext'

interface UseAddUploadedFilesToDatasetReturn {
  submitUploadedFilesToDataset: (uploadedFiles: UploadedFileInfo[]) => Promise<void>
}

export const useAddUploadedFilesToDataset = (
  fileRepository: FileRepository,
  datasetPersistentId: string
): UseAddUploadedFilesToDatasetReturn => {
  const { setIsSaving, setAddFilesToDatasetOperationInfo, removeAllFiles } =
    useFileUploaderContext()
  //   const { t } = useTranslation('replaceFile')

  const submitUploadedFilesToDataset = async (uploadedFiles: UploadedFileInfo[]) => {
    setIsSaving(true)

    const uploadedFilesDTO: UploadedFileDTO[] = uploadedFiles.map((newFileInfo) => ({
      storageId: newFileInfo.storageId,
      checksumValue: newFileInfo.checksumValue,
      checksumType: newFileInfo.checksumAlgorithm,
      fileName: newFileInfo.fileName,
      description: newFileInfo.description,
      directoryLabel: newFileInfo.fileDir,
      // categories?: string[];
      // restrict?: boolean;
      mimeType: newFileInfo.fileType === '' ? 'application/octet-stream' : newFileInfo.fileType // some browsers (e.g., chromium for .java files) fail to detect the mime type for some files and leave the fileType as an empty string, we use the default value 'application/octet-stream' in that case
    }))

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
        // toast.error(t('defaultFileReplaceError'))
        toast.error('defaultAddUploadedFilesError')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    submitUploadedFilesToDataset
  }
}
