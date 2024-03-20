import { CreateDatasetForm } from './CreateDatasetForm'
import { ReactElement } from 'react'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'

const repository = new DatasetJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class CreateDatasetFactory {
  static create(): ReactElement {
    return (
      <CreateDatasetForm
        repository={repository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
  }
}
