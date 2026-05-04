import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CreateDataset } from './CreateDataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { TemplateJSDataverseRepository } from '../../templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const datasetRepository = new DatasetJSDataverseRepository()
const templateRepository = new TemplateJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()

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
    <RepositoriesProvider collectionRepository={collectionRepository}>
      <CreateDataset
        datasetRepository={datasetRepository}
        templateRepository={templateRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionId={collectionId}
      />
    </RepositoriesProvider>
  )
}
