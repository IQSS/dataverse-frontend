import { CreateDatasetFormPresenter } from './CreateDatasetForm'
import { CreateDatasetProvider } from './CreateDatasetProvider'
import { formValidationService } from '../../dataset/domain/useCases/createDataset'
import { formSubmissionService } from '../../dataset/domain/useCases/createDataset'
import { ReactElement } from 'react'
export const CreateDatasetForm: React.FC = () => {
  return (
    <CreateDatasetProvider>
      <CreateDatasetFormPresenter
        formValidationService={formValidationService}
        formSubmissionService={formSubmissionService}
      />
    </CreateDatasetProvider>
  )
}

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <CreateDatasetForm />
  }
}
