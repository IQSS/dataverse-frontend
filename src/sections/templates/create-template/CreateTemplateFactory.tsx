import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { TemplateJSDataverseRepository } from '@/templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { CreateTemplate } from './index'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const templateRepository = new TemplateJSDataverseRepository()

export class CreateTemplateFactory {
  static create(): ReactElement {
    return <CreateTemplateWithParams />
  }
}

function CreateTemplateWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as { collectionId: string }

  return (
    <CreateTemplate
      collectionId={collectionId}
      collectionRepository={collectionRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      templateRepository={templateRepository}
    />
  )
}
