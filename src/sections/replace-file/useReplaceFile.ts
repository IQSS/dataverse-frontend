import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { UploadedFileDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { replaceFile } from '@/files/domain/useCases/replaceFile'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { UploadedFileInfo } from '../shared/file-uploader-panel/uploaded-files-list/UploadedFileInfo'

interface UseReplaceFileReturn {
  isReplacingFile: boolean
  newFileID: number | null
  handleReplaceFile: (fileId: number, file: UploadedFileInfo) => Promise<void>
}

export const useReplaceFile = (fileRepository: FileRepository): UseReplaceFileReturn => {
  const { t } = useTranslation('replaceFile')
  const [isReplacingFile, setIsReplacingFile] = useState<boolean>(false)
  const [newFileID, setNewFileID] = useState<number | null>(null)

  const handleReplaceFile = async (fileId: number, newFileInfo: UploadedFileInfo) => {
    setIsReplacingFile(true)

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
      const newFileIdentifier = await replaceFile(fileRepository, fileId, newFileDTO)

      setNewFileID(newFileIdentifier)
      toast.success(t('fileReplacedSuccessfully'))
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        toast.error(t(formattedError))
      } else {
        toast.error(t('defaultFileReplaceError'))
      }
    } finally {
      setIsReplacingFile(false)
    }
  }

  return {
    newFileID,
    isReplacingFile,
    handleReplaceFile
  }
}
