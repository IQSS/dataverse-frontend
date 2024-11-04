import { ReactElement } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { Collection } from './Collection'
import { INFINITE_SCROLL_ENABLED } from './config'
import { useGetCollectionQueryParams } from './useGetCollectionQueryParams'

const collectionRepository = new CollectionJSDataverseRepository()
export class CollectionFactory {
  static create(): ReactElement {
    return <CollectionWithSearchParams />
  }
}

function CollectionWithSearchParams() {
  const collectionQueryParams = useGetCollectionQueryParams()
  const { collectionId } = useParams<{ collectionId: string }>()
  const location = useLocation()
  const state = location.state as { published: boolean; created: boolean } | undefined
  const created = state?.created ?? false
  const published = state?.published ?? false

  return (
    <Collection
      collectionRepository={collectionRepository}
      collectionIdFromParams={collectionId}
      created={created}
      collectionQueryParams={collectionQueryParams}
      published={published}
      infiniteScrollEnabled={INFINITE_SCROLL_ENABLED}
    />
  )
}
