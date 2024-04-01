import { CreateDatasetForm } from './CreateDatasetForm'
import { ReactElement } from 'react'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { MetadataBlockInfoMockRepository } from '../../stories/create-dataset/MetadataBlockInfoMockRepository'

const repository = new DatasetJSDataverseRepository()
const _metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const metadataBlockInfoMockRepository = new MetadataBlockInfoMockRepository()

export class CreateDatasetFactory {
  static create(): ReactElement {
    return (
      <CreateDatasetForm
        repository={repository}
        metadataBlockInfoRepository={metadataBlockInfoMockRepository}
      />
    )
  }
}
