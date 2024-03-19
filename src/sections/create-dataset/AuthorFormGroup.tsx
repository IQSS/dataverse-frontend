import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus } from './useCreateDatasetForm'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'
//import { useDatasetValidator } from './useDatasetValidator'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { useDatasetFormData } from './useDatasetFormData'
import { useDatasetValidator } from './useDatasetValidator'

interface AuthorFormGroupProps {
  submissionStatus: SubmissionStatus
  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  validationErrors: DatasetDTO

}

export function AuthorFormGroup({
  submissionStatus,
  handleFieldChange,
  validationErrors
}: AuthorFormGroupProps) {
  const { t } = useTranslation('createDataset')
  const { datasetIsValid } = useDatasetValidator()
  const { formData, updateFormData } = useDatasetFormData(datasetIsValid)

  console.log(JSON.stringify(validationErrors))
  const index = 0
  return (
    <Form.Group controlId="author-name" required>
      <Form.Group.Label message={t('datasetForm.fields.authorName.tooltip')}>
        {t('datasetForm.fields.authorName.label')}
      </Form.Group.Label>
      <Form.Group.Input
        disabled={submissionStatus === SubmissionStatus.IsSubmitting}
        type="text"
        name={`metadataBlocks.0.fields.author.${index}.authorName`}
        onChange={handleFieldChange}
        isInvalid={
          !!(validationErrors.metadataBlocks[index].fields.author as DatasetMetadataSubField[])[
            index
          ].authorName
        }
      />
      <Form.Group.Feedback type="invalid">
        {t('datasetForm.fields.authorName.feedback')}
      </Form.Group.Feedback>
    </Form.Group>
  )
}
