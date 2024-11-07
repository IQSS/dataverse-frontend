import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { EditCollectionGeneralInfo } from './EditCollectionGeneralInfo'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class EditCollectionGeneralInfoFactory {
  static create(): ReactElement {
    return <EditCollectionGeneralInfoWithParams />
  }
}

function EditCollectionGeneralInfoWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as {
    collectionId: string
  }
  return (
    <EditCollectionGeneralInfo
      collectionId={collectionId}
      collectionRepository={collectionRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
    />
  )
}
