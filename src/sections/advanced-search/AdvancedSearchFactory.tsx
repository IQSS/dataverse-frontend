import { ReactElement } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { AdvancedSearch } from './AdvancedSearch'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

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
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      <AdvancedSearch
        collectionId={collectionId}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionFilterQueries={collectionPageCurrentFilterQueries}
      />
    </RepositoriesProvider>
  )
}
