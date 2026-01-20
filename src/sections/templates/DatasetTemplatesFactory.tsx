import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { TemplateJSDataverseRepository } from '@/templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { DatasetTemplates } from './DatasetTemplates'

const collectionRepository = new CollectionJSDataverseRepository()
const templateRepository = new TemplateJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class DatasetTemplatesFactory {
  static create(): ReactElement {
    return (
      // NotImplementedModalProvider should be removed after all features are implemented
      <NotImplementedModalProvider>
        <DatasetTemplatesWithParams />
      </NotImplementedModalProvider>
    )
  }
}

function DatasetTemplatesWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <DatasetTemplates
      collectionRepository={collectionRepository}
      templateRepository={templateRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      collectionId={collectionId ?? 'root'}
    />
  )
}
