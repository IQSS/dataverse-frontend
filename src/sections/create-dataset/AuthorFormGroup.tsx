import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus } from './useCreateDatasetForm'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'
import { useDatasetValidator } from './useDatasetValidator'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'

interface AuthorFormGroupProps {
  submissionStatus: SubmissionStatus
  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  validationErrors: DatasetDTO
}

export function AuthorFormGroup({ submissionStatus, handleFieldChange }: AuthorFormGroupProps) {
  const { t } = useTranslation('createDataset')
  const { validationErrors, datasetIsValid } = useDatasetValidator()
  return (
    <Form.Group controlId="author-name" required>
      <Form.Group.Label message={t('datasetForm.fields.authorName.tooltip')}>
        {t('datasetForm.fields.authorName.label')}
      </Form.Group.Label>
      <Form.Group.Input
        disabled={submissionStatus === SubmissionStatus.IsSubmitting}
        type="text"
        name="metadataBlocks.0.fields.author.0.authorName"
        onChange={handleFieldChange}
        isInvalid={
          !!(validationErrors.metadataBlocks[0].fields.author as DatasetMetadataSubField[])[0]
            .authorName
        }
      />
      <Form.Group.Feedback type="invalid">
        {t('datasetForm.fields.authorName.feedback')}
      </Form.Group.Feedback>
    </Form.Group>
  )
}
