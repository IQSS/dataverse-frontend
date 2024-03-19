import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus } from './useCreateDatasetForm'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'
//import { useDatasetValidator } from './useDatasetValidator'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { useDatasetFormData } from './useDatasetFormData'
import { useDatasetValidator } from './useDatasetValidator'
import { Col, Row } from '@iqss/dataverse-design-system'
import { DynamicFieldsButtons } from './dynamic-fields-buttons/DynamicFieldsButtons'
interface AuthorFormGroupProps {
  submissionStatus: SubmissionStatus
  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void
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
  const index = 0

  console.log(JSON.stringify(validationErrors))

  return (
    <Form.Group controlId="author-name" required>
      <Row key={index}>
        <Col sm={3}>
          <Form.Group.Label message={t('datasetForm.fields.authorName.tooltip')}>
            {t('datasetForm.fields.authorName.label')}
          </Form.Group.Label>
        </Col>
        <Col sm={6}>
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
        </Col>
        <Col sm={3}>
          <DynamicFieldsButtons
            originalField={index === 0}
            onAddButtonClick={() => updateFormData('metadataBlocks.0.fields.author', '')}
            onRemoveButtonClick={() => updateFormData('metadataBlocks.0.fields.author', '')}
          />
        </Col>
      </Row>
    </Form.Group>
  )
}
