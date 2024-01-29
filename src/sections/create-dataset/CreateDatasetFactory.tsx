import { CreateDatasetForm } from './CreateDatasetForm'
import { ReactElement } from 'react'

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetForm />
  }
}
