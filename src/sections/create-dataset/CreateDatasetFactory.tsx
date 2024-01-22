import { CreateDatasetForm } from './CreateDatasetForm'
import { ReactElement } from 'react'
export const CreateDatasetFormPresenter: React.FC = () => {
  return <CreateDatasetForm />
}

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetFormPresenter />
  }
}
