import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { deleteFile } from '@/files/domain/useCases/deleteFile'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseDeleteFile {
  fileRepository: FileRepository
  onSuccessfulDelete?: () => void
}

interface UseDeleteFileReturn {
  isDeletingFile: boolean
  errorDeletingFile: string | null
  handleDeleteFile: (fileId: number) => Promise<void>
}

export const useDeleteFile = ({
  fileRepository,
  onSuccessfulDelete
}: UseDeleteFile): UseDeleteFileReturn => {
  const { t } = useTranslation('file')
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false)
  const [errorDeletingFile, setErrorDeletingFile] = useState<string | null>(null)

  const handleDeleteFile = async (fileId: number) => {
    setIsDeletingFile(true)

    try {
      await deleteFile(fileRepository, fileId)

      onSuccessfulDelete?.()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorDeletingFile(formattedError)
      } else {
        setErrorDeletingFile(t('defaultFileDeleteError'))
      }
    } finally {
      setIsDeletingFile(false)
    }
  }

  return {
    isDeletingFile,
    errorDeletingFile,
    handleDeleteFile
  }
}
