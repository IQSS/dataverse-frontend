import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { GuestbookResponses } from './GuestbookResponses'

const collectionRepository = new CollectionJSDataverseRepository()

export class GuestbookResponsesFactory {
  static create(): ReactElement {
    return <GuestbookResponsesWithParams />
  }
}

function GuestbookResponsesWithParams() {
  const { collectionId, guestbookId } = useParams<{
    collectionId: string
    guestbookId: string
  }>()
  const parsedGuestbookId = Number(guestbookId)

  if (!collectionId || !Number.isInteger(parsedGuestbookId)) {
    return <NotFoundPage />
  }

  return (
    <GuestbookResponses
      collectionId={collectionId}
      guestbookId={parsedGuestbookId}
      collectionRepository={collectionRepository}
    />
  )
}
