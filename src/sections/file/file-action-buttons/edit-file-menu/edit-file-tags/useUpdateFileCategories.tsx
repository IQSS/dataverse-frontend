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
  isLoading: boolean
  error: string | null
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateCategories = async (
    fileId: number | string,
    categories: string[],
    replace?: boolean
  ) => {
    setIsLoading(true)

    try {
      await fileRepository.updateCategories(fileId, categories, replace)
      onSuccessfulUpdateCategories()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setError(formattedError)
      } else {
        setError(t('defaultFileUpdateError'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleUpdateCategories,
    isLoading,
    error
  }
}
