import { ReactElement } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { Collection } from './Collection'
import { INFINITE_SCROLL_ENABLED } from './config'

const collectionRepository = new CollectionJSDataverseRepository()
export class CollectionFactory {
  static create(): ReactElement {
    return <CollectionWithSearchParams />
  }
}

function CollectionWithSearchParams() {
  const [searchParams] = useSearchParams()
  const { collectionId = 'root' } = useParams<{ collectionId: string }>()
  const location = useLocation()
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : undefined
  const state = location.state as { created: boolean } | undefined
  const created = state?.created ?? false

  return (
    <Collection
      collectionRepository={collectionRepository}
      page={page}
      collectionId={collectionId}
      created={created}
      infiniteScrollEnabled={INFINITE_SCROLL_ENABLED}
    />
  )
}
