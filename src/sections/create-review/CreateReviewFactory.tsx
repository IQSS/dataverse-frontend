import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CreateReview } from './CreateReview'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()

export class CreateReviewFactory {
  static create(): ReactElement {
    return (
      <NotImplementedModalProvider>
        <CreateReviewWithSearchParams />
      </NotImplementedModalProvider>
    )
  }
}

function CreateReviewWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as { collectionId: string }

  return (
    <CreateReview
      datasetRepository={datasetRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      collectionRepository={collectionRepository}
      collectionId={collectionId}
    />
  )
}
