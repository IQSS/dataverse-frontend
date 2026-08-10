import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { CreateGuestbook } from './CreateGuestbook'

const collectionRepository = new CollectionJSDataverseRepository()

export class CreateGuestbookFactory {
  static create(): ReactElement {
    return <CreateGuestbookWithParams />
  }
}

function CreateGuestbookWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as { collectionId: string }

  return <CreateGuestbook collectionId={collectionId} collectionRepository={collectionRepository} />
}
