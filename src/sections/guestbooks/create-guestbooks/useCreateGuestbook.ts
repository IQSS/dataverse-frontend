import { useState } from 'react'
import { type CreateGuestbookDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { createGuestbook } from '@/guestbooks/domain/useCases/createGuestbook'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseCreateGuestbookProps {
  guestbookRepository: GuestbookRepository
  collectionIdOrAlias: number | string
  onSuccessfulCreate?: (guestbookId: number) => void
}

export const useCreateGuestbook = ({
  guestbookRepository,
  collectionIdOrAlias,
  onSuccessfulCreate
}: UseCreateGuestbookProps) => {
  const [isCreatingGuestbook, setIsCreatingGuestbook] = useState(false)
  const [errorCreatingGuestbook, setErrorCreatingGuestbook] = useState<string | null>(null)

  const handleCreateGuestbook = async (guestbook: CreateGuestbookDTO) => {
    setIsCreatingGuestbook(true)
    setErrorCreatingGuestbook(null)

    try {
      const guestbookId = await createGuestbook(guestbookRepository, collectionIdOrAlias, guestbook)
      onSuccessfulCreate?.(guestbookId)
      return guestbookId
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorCreatingGuestbook(formattedError)
      } else {
        setErrorCreatingGuestbook('Something went wrong creating the guestbook. Try again later.')
      }
    } finally {
      setIsCreatingGuestbook(false)
    }
  }

  return {
    isCreatingGuestbook,
    errorCreatingGuestbook,
    handleCreateGuestbook
  }
}
