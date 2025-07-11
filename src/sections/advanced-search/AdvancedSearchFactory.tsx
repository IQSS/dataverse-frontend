import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { AdvancedSearch } from './AdvancedSearch'

const collectionRepository = new CollectionJSDataverseRepository()
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

  return (
    <AdvancedSearch
      collectionId={collectionId}
      collectionRepository={collectionRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
    />
  )
}
