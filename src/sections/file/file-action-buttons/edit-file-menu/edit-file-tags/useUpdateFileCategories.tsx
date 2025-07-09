import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface UseUpdateFileCategories {
  fileRepository: FileRepository
  onSuccessfulUpdateCategories: () => void
}

interface UseUpdateFileCategoriesReturn {
  isUpdatingCategories: boolean
  errorUpdatingCategories: string | null
  handleUpdateCategories: (
    fileId: number | string,
    categories: string[],
    replace?: boolean
  ) => Promise<void>
}

export const useUpdateFileCategories = ({
  fileRepository,
  onSuccessfulUpdateCategories
}: UseUpdateFileCategories): UseUpdateFileCategoriesReturn => {
  const { t } = useTranslation('file')
  const [isUpdatingCategories, setIsUpdatingCategories] = useState(false)
  const [errorUpdatingCategories, setErrorUpdatingCategories] = useState<string | null>(null)

  const handleUpdateCategories = async (
    fileId: number | string,
    categories: string[],
    replace?: boolean
  ) => {
    setIsUpdatingCategories(true)

    try {
      await fileRepository.UpdateFileCategories(fileId, categories, replace)

      onSuccessfulUpdateCategories()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorUpdatingCategories(formattedError)
      } else {
        setErrorUpdatingCategories(t('defaultFileDeleteError'))
      }
    } finally {
      setIsUpdatingCategories(false)
      setErrorUpdatingCategories(null)
    }
  }

  return {
    handleUpdateCategories,
    isUpdatingCategories,
    errorUpdatingCategories
  }
}
