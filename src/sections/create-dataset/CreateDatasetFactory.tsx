import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CreateDatasetForm } from './CreateDatasetForm'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
// import { MetadataBlockInfoMockRepository } from '../../stories/create-dataset/MetadataBlockInfoMockRepository'

const repository = new DatasetJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
// const metadataBlockInfoMockRepository = new MetadataBlockInfoMockRepository()

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetFormWithSearchParams />
  }
}

function CreateDatasetFormWithSearchParams() {
  const [searchParams] = useSearchParams()
  const collectionId = searchParams.get('collectionId') ?? undefined

  return (
    <CreateDatasetForm
      repository={repository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      collectionId={collectionId}
    />
  )
}
