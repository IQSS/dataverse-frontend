import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { UploadedFileDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { replaceFile } from '@/files/domain/useCases/replaceFile'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { UploadedFileInfo } from '../shared/file-uploader-panel/uploaded-files-list/UploadedFileInfo'
import { QueryParamKey, Route } from '../Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'

interface UseReplaceFileReturn {
  isReplacingFile: boolean
  errorReplacingFile: string | null
  handleReplaceFile: (fileId: number, file: UploadedFileInfo) => Promise<void>
}

export const useReplaceFile = (fileRepository: FileRepository): UseReplaceFileReturn => {
  const navigate = useNavigate()
  const { t } = useTranslation('replaceFile')
  const [isReplacingFile, setIsReplacingFile] = useState<boolean>(false)
  const [errorReplacingFile, setErrorReplacingFile] = useState<string | null>(null)

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
      mimeType: newFileInfo.fileType,
      forceReplace: true
    }

    try {
      const newFileIdentifier = await replaceFile(fileRepository, fileId, newFileDTO)

      toast.success(t('fileReplacedSuccessfully'))

      navigate(
        `${Route.FILES}?id=${newFileIdentifier}&${QueryParamKey.DATASET_VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
      )
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorReplacingFile(formattedError)
      } else {
        setErrorReplacingFile(t('defaultFileReplaceError'))
      }
    } finally {
      setIsReplacingFile(false)
    }
  }

  return {
    isReplacingFile,
    errorReplacingFile,
    handleReplaceFile
  }
}
