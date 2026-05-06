import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CreateDataset } from './CreateDataset'
import { TemplateJSDataverseRepository } from '../../templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'

const templateRepository = new TemplateJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class CreateDatasetFactory {
  static create(): ReactElement {
    return (
      <NotImplementedModalProvider>
        <CreateDatasetWithSearchParams />
      </NotImplementedModalProvider>
    )
  }
}

function CreateDatasetWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as { collectionId: string }

  return (
    <CreateDataset
      templateRepository={templateRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      collectionId={collectionId}
    />
  )
}
