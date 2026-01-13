import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { CreateDatasetTemplate } from './index'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class CreateDatasetTemplateFactory {
  static create(): ReactElement {
    return <CreateDatasetTemplateWithParams />
  }
}

function CreateDatasetTemplateWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as { collectionId: string }

  return (
    <CreateDatasetTemplate
      collectionId={collectionId}
      collectionRepository={collectionRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
    />
  )
}
