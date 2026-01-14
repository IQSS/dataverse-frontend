import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { TemplateJSDataverseRepository } from '@/templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { EditDatasetTemplateMetadata } from './index'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const templateRepository = new TemplateJSDataverseRepository()

export class EditTemplateMetadataFactory {
  static create(): ReactElement {
    return <EditTemplateMetadataWithParams />
  }
}

function EditTemplateMetadataWithParams() {
  const { collectionId, templateId } = useParams<{
    collectionId: string
    templateId: string
  }>() as {
    collectionId: string
    templateId: string
  }

  return (
    <EditDatasetTemplateMetadata
      collectionId={collectionId}
      templateId={Number(templateId)}
      collectionRepository={collectionRepository}
      templateRepository={templateRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
    />
  )
}
