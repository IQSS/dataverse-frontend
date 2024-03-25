import { CreateDatasetForm } from './CreateDatasetForm'
import { ReactElement } from 'react'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'

const repository = new DatasetJSDataverseRepository()

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetForm repository={repository} />
  }
}
