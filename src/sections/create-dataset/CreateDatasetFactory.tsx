import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CreateDataset } from './CreateDataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'

const repository = new DatasetJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetWithSearchParams />
  }
}

function CreateDatasetWithSearchParams() {
  const [searchParams] = useSearchParams()
  const collectionId = searchParams.get('collectionId') ?? undefined

  return (
    <CreateDataset
      repository={repository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      collectionId={collectionId}
    />
  )
}
