import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { EditFeaturedItems } from './EditFeaturedItems'

export class EditFeaturedItemsFactory {
  static create(): ReactElement {
    return <EditFeaturedItemsWithSearchParams />
  }
}

function EditFeaturedItemsWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return <EditFeaturedItems collectionIdFromParams={collectionId} />
}
