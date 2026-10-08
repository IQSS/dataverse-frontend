import { ReactElement } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { AdvancedSearch } from './AdvancedSearch'

const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

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
  const collectionPageCurrentFilterQueries =
    searchParams.get(CollectionItemsQueryParams.FILTER_QUERIES) ?? undefined

  return (
    <AdvancedSearch
      collectionId={collectionId}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      collectionFilterQueries={collectionPageCurrentFilterQueries}
    />
  )
}
