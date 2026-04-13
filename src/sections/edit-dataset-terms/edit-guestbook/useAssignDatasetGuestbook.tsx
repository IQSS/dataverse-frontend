import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { assignDatasetGuestbook } from '@/guestbooks/domain/useCases/assignDatasetGuestbook'

interface UseAssignDatasetGuestbookProps {
  guestbookRepository: GuestbookRepository
  onSuccessfulAssignDatasetGuestbook: () => void
}

interface UseAssignDatasetGuestbookReturn {
  isLoadingAssignDatasetGuestbook: boolean
  errorAssignDatasetGuestbook: string | null
  handleAssignDatasetGuestbook: (datasetId: number | string, guestbookId: number) => Promise<void>
}

export const useAssignDatasetGuestbook = ({
  guestbookRepository,
  onSuccessfulAssignDatasetGuestbook
}: UseAssignDatasetGuestbookProps): UseAssignDatasetGuestbookReturn => {
  const { t } = useTranslation('dataset')
  const [isLoadingAssignDatasetGuestbook, setIsLoadingAssignDatasetGuestbook] = useState(false)
  const [errorAssignDatasetGuestbook, setErrorAssignDatasetGuestbook] = useState<string | null>(
    null
  )

  const handleAssignDatasetGuestbook = async (datasetId: number | string, guestbookId: number) => {
    setIsLoadingAssignDatasetGuestbook(true)
    setErrorAssignDatasetGuestbook(null)

    try {
      await assignDatasetGuestbook(guestbookRepository, datasetId, guestbookId)
      onSuccessfulAssignDatasetGuestbook()
    } catch (err) {
      if (err instanceof WriteError) {
        const errorHandler = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()
        setErrorAssignDatasetGuestbook(formattedError)
      } else {
        setErrorAssignDatasetGuestbook(t('editTerms.defaultGuestbookUpdateError'))
      }
    } finally {
      setIsLoadingAssignDatasetGuestbook(false)
    }
  }

  return {
    isLoadingAssignDatasetGuestbook,
    errorAssignDatasetGuestbook,
    handleAssignDatasetGuestbook
  }
}
