import { useState } from 'react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { useTranslation } from 'react-i18next'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { GuestbookDTO } from '@/guestbooks/domain/useCases/DTOs/GuestbookDTO'
import { editGuestbook } from '@/guestbooks/domain/useCases/editGuestbook'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseEditGuestbookProps {
  guestbookRepository: GuestbookRepository
  onSuccessfulEdit?: () => void
}

const formatWriteErrorMessage = (error: WriteError): string => {
  const errorHandler = new JSDataverseWriteErrorHandler(error)

  return errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()
}

const isWriteErrorLike = (error: unknown): error is WriteError =>
  error instanceof WriteError ||
  (error instanceof Error &&
    error.message.includes('There was an error when writing the resource.'))

export const useEditGuestbook = ({
  guestbookRepository,
  onSuccessfulEdit
}: UseEditGuestbookProps) => {
  const { t } = useTranslation('guestbooks')
  const [isEditingGuestbook, setIsEditingGuestbook] = useState(false)
  const [errorEditingGuestbook, setErrorEditingGuestbook] = useState<string | null>(null)

  const handleEditGuestbook = async (guestbookId: number, guestbook: GuestbookDTO) => {
    setIsEditingGuestbook(true)
    setErrorEditingGuestbook(null)

    try {
      await editGuestbook(guestbookRepository, guestbookId, guestbook)
      onSuccessfulEdit?.()
    } catch (err: WriteError | unknown) {
      if (isWriteErrorLike(err)) {
        setErrorEditingGuestbook(formatWriteErrorMessage(err))
      } else if (err instanceof Error && err.message) {
        setErrorEditingGuestbook(err.message)
      } else {
        setErrorEditingGuestbook(t('errors.editGuestbook'))
      }
    } finally {
      setIsEditingGuestbook(false)
    }
  }

  return {
    isEditingGuestbook,
    errorEditingGuestbook,
    handleEditGuestbook
  }
}
