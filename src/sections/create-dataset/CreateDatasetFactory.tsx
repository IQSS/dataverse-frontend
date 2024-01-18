import { CreateDatasetFormPresenter } from './CreateDatasetForm'
import { formValidationService } from '../../dataset/domain/useCases/createDataset'
import { formSubmissionService } from '../../dataset/domain/useCases/createDataset'
import { ReactElement } from 'react'
export const CreateDatasetForm: React.FC = () => {
  return (
    <CreateDatasetFormPresenter
      formValidationService={formValidationService}
      formSubmissionService={formSubmissionService}
    />
  )
}

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetForm />
  }
}
