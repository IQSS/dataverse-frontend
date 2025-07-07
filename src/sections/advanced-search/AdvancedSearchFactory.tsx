import { ReactElement } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { AdvancedSearch } from './AdvancedSearch'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'

const collectionRepository = new CollectionJSDataverseRepository()

export class AdvancedSearchFactory {
  static create(): ReactElement {
    return <AdvancedSearchWithSearchParams />
  }
}

function AdvancedSearchWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as {
    collectionId: string
  }
  const [searchParams] = useSearchParams()

  const collectionPageQuery: string | null = searchParams.get(CollectionItemsQueryParams.QUERY)

  return (
    <AdvancedSearch
      collectionId={collectionId}
      collectionRepository={collectionRepository}
      collectionPageQuery={collectionPageQuery}
    />
  )
}
