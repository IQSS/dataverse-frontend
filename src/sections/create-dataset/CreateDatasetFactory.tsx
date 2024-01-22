import { CreateDatasetForm } from './CreateDatasetForm'
import { ReactElement } from 'react'
export function CreateDatasetFormPresenter() {
  return <CreateDatasetForm />
}

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetFormPresenter />
  }
}
