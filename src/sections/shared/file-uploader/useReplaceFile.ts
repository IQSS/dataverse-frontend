import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { replaceFile } from '@/files/domain/useCases/replaceFile'
import { UploadedFileDTOMapper } from '@/files/infrastructure/mappers/UploadedFileDTOMapper'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { useFileUploaderContext } from './context/FileUploaderContext'
import { UploadedFile } from './context/fileUploaderReducer'
import { UploaderFileRepository, FullUploaderFileRepository } from './types'

// WriteError type for error handling - avoid importing from client library due to CommonJS issues
interface WriteErrorLike {
  reason?: string
  message?: string
}

interface UseReplaceFileReturn {
  submitReplaceFile: (originalFileID: number, file: UploadedFile) => Promise<void>
}

/** Type guard to check if repository supports replace */
function hasReplaceMethod(repo: UploaderFileRepository): repo is FullUploaderFileRepository {
  return 'replace' in repo && typeof repo.replace === 'function'
}

export const useReplaceFile = (fileRepository: UploaderFileRepository): UseReplaceFileReturn => {
  const { setIsSaving, setReplaceOperationInfo, removeAllFiles } = useFileUploaderContext()
  const { t } = useTranslation('shared')

  const submitReplaceFile = async (originalFileID: number, newFileInfo: UploadedFile) => {
    // Check if replace is supported
    if (!hasReplaceMethod(fileRepository)) {
      toast.error('File replacement is not supported in standalone mode')
      return
    }

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
