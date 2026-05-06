import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { EditCollection } from './EditCollection'

const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class EditCollectionFactory {
  static create(): ReactElement {
    return <EditCollectionWithParams />
  }
}

function EditCollectionWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as {
    collectionId: string
  }

  return (
    <EditCollection
      collectionId={collectionId}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
    />
  )
}
