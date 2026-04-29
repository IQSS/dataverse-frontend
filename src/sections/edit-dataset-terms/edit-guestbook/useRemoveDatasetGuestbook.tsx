import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { removeDatasetGuestbook } from '@/guestbooks/domain/useCases/removeDatasetGuestbook'

interface UseRemoveDatasetGuestbookProps {
  guestbookRepository: GuestbookRepository
  onSuccessfulRemoveDatasetGuestbook: () => void
}

interface UseRemoveDatasetGuestbookReturn {
  isLoadingRemoveDatasetGuestbook: boolean
  errorRemoveDatasetGuestbook: string | null
  handleRemoveDatasetGuestbook: (datasetId: number | string) => Promise<void>
}

export const useRemoveDatasetGuestbook = ({
  guestbookRepository,
  onSuccessfulRemoveDatasetGuestbook
}: UseRemoveDatasetGuestbookProps): UseRemoveDatasetGuestbookReturn => {
  const { t } = useTranslation('dataset')
  const [isLoadingRemoveDatasetGuestbook, setIsLoadingRemoveDatasetGuestbook] = useState(false)
  const [errorRemoveDatasetGuestbook, setErrorRemoveDatasetGuestbook] = useState<string | null>(
    null
  )

  const handleRemoveDatasetGuestbook = async (datasetId: number | string) => {
    setIsLoadingRemoveDatasetGuestbook(true)
    setErrorRemoveDatasetGuestbook(null)

    try {
      await removeDatasetGuestbook(guestbookRepository, datasetId)
      onSuccessfulRemoveDatasetGuestbook()
    } catch (err) {
      console.log('removeDatasetGuestbook error', err)
      if (err instanceof WriteError) {
        const errorHandler = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()
        setErrorRemoveDatasetGuestbook(formattedError)
      } else {
        setErrorRemoveDatasetGuestbook(t('editTerms.defaultGuestbookUpdateError'))
      }
    } finally {
      setIsLoadingRemoveDatasetGuestbook(false)
    }
  }

  return {
    isLoadingRemoveDatasetGuestbook,
    errorRemoveDatasetGuestbook,
    handleRemoveDatasetGuestbook
  }
}
