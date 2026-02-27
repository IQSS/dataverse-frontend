import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { Guestbooks } from './ManageGuestbooks'

const collectionRepository = new CollectionJSDataverseRepository()

export class GuestbooksFactory {
  static create(): ReactElement {
    return <GuestbooksWithParams />
  }
}

function GuestbooksWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <Guestbooks collectionRepository={collectionRepository} collectionId={collectionId ?? 'root'} />
  )
}
