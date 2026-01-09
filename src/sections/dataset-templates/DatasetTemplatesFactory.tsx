import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { TemplateJSDataverseRepository } from '@/templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { DatasetTemplates } from './DatasetTemplates'

const collectionRepository = new CollectionJSDataverseRepository()
const templateRepository = new TemplateJSDataverseRepository()

export class DatasetTemplatesFactory {
  static create(): ReactElement {
    return (
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
      collectionIdFromParams={collectionId}
    />
  )
}
