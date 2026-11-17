import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { EditGuestbook } from './EditGuestbook'

const collectionRepository = new CollectionJSDataverseRepository()

export class EditGuestbookFactory {
  static create(): ReactElement {
    return <EditGuestbookWithParams />
  }
}

function EditGuestbookWithParams() {
  const { collectionId, guestbookId } = useParams<{
    collectionId: string
    guestbookId: string
  }>()
  const parsedGuestbookId = Number(guestbookId)

  if (!collectionId || !Number.isInteger(parsedGuestbookId)) {
    return <NotFoundPage />
  }

  return (
    <EditGuestbook
      collectionId={collectionId}
      guestbookId={parsedGuestbookId}
      collectionRepository={collectionRepository}
    />
  )
}
