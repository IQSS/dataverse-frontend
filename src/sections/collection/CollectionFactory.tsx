import { ReactElement } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { Collection } from './Collection'
import { INFINITE_SCROLL_ENABLED } from './config'
import { useCollectionQueryParams } from './useCollectionQueryParams'

const collectionRepository = new CollectionJSDataverseRepository()
export class CollectionFactory {
  static create(): ReactElement {
    return <CollectionWithSearchParams />
  }
}

function CollectionWithSearchParams() {
  const collectionQueryParams = useCollectionQueryParams()
  const { collectionId = 'root' } = useParams<{ collectionId: string }>()
  const location = useLocation()
  const state = location.state as { created: boolean } | undefined
  const created = state?.created ?? false

  return (
    <Collection
      collectionRepository={collectionRepository}
      collectionId={collectionId}
      created={created}
      collectionQueryParams={collectionQueryParams}
      infiniteScrollEnabled={INFINITE_SCROLL_ENABLED}
    />
  )
}
