import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface UseUpdateFileTabularTags {
  fileRepository: FileRepository
  onSuccessfulUpdateTabularTags: () => void
}

interface UseUpdateFileTabularTagsReturn {
  isLoading: boolean
  error: string | null
  handleUpdateTabularTags: (
    fileId: number | string,
    TabularTags: string[],
    replace?: boolean
  ) => Promise<void>
}

export const useUpdateFileTabularTags = ({
  fileRepository,
  onSuccessfulUpdateTabularTags
}: UseUpdateFileTabularTags): UseUpdateFileTabularTagsReturn => {
  const { t } = useTranslation('file')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateTabularTags = async (
    fileId: number | string,
    TabularTags: string[],
    replace?: boolean
  ) => {
    setIsLoading(true)

    try {
      await fileRepository.UpdateFileTabularTags(fileId, TabularTags, replace)
      console.log(
        'handleUpdateTabularTags onSuccessfulUpdateTabularTags',
        fileId,
        TabularTags,
        replace
      )

      onSuccessfulUpdateTabularTags()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setError(formattedError)
      } else {
        setError(t('defaultFileDeleteError'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleUpdateTabularTags,
    isLoading,
    error
  }
}
