import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus } from './useCreateDatasetForm'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'
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
  const { datasetIsValid, addErrorField, removeErrorField } = useDatasetValidator()
  const { formData, updateFormData, addField, removeField } = useDatasetFormData(datasetIsValid)
  const authorFields = formData.metadataBlocks[0].fields.author as DatasetMetadataSubField[]
  const isAuthorValid = (index: number) => {
    //  !!(validationErrors.metadataBlocks[0].fields.author as DatasetMetadataSubField[])[
    //    index
    //  ].authorName
    return false
  }
  return (
    <>
      {authorFields.map((author, index) => (
        <Form.Group controlId={`author-name-${index}`} required key={index}>
          <Row>
            <Col sm={3}>
              {index === 0 && (
                <Form.Group.Label message={t('datasetForm.fields.authorName.tooltip')}>
                  {t('datasetForm.fields.authorName.label')}
                </Form.Group.Label>
              )}
            </Col>
            <Col sm={6}>
              <Form.Group.Input
                disabled={submissionStatus === SubmissionStatus.IsSubmitting}
                type="text"
                name={`metadataBlocks.0.fields.author.${index}.authorName`}
                onChange={handleFieldChange}
                isInvalid={isAuthorValid(index)}
              />
              <Form.Group.Feedback type="invalid">
                {t('datasetForm.fields.authorName.feedback')}
              </Form.Group.Feedback>
            </Col>
            <Col sm={3}>
              <DynamicFieldsButtons
                originalField={index === 0}
                onAddButtonClick={() => {
                  addErrorField(`metadataBlocks.0.fields.author`, index)
                  addField(`metadataBlocks.0.fields.author`, index)
                }}
                onRemoveButtonClick={() => {
                  removeErrorField(`metadataBlocks.0.fields.author`, index)
                  removeField(`metadataBlocks.0.fields.author`, index)
                }}
              />
            </Col>
          </Row>
        </Form.Group>
      ))}
    </>
  )
}
