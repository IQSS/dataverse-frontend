import { ReactElement } from 'react'
import { Collection } from './Collection'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { INFINITE_SCROLL_ENABLED } from './config'

const datasetRepository = new DatasetJSDataverseRepository()
const repository = new CollectionJSDataverseRepository()
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
      repository={repository}
      datasetRepository={datasetRepository}
      page={page}
      id={collectionId}
      created={created}
      infiniteScrollEnabled={INFINITE_SCROLL_ENABLED}
    />
  )
}
