import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus } from './useCreateDatasetForm'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'
import { Col, Row } from '@iqss/dataverse-design-system'
import { DynamicFieldsButtons } from './dynamic-fields-buttons/DynamicFieldsButtons'

import { FormEvent } from 'react'
import _ from 'lodash'
import { FormInputElement } from '@iqss/dataverse-design-system/dist/components/form/form-group/form-element/FormInput'
import { useMultipleFields } from './useMultipleFields'
interface AuthorFormGroupProps {
  submissionStatus: SubmissionStatus
  initialAuthorFields: DatasetMetadataSubField[]
}

export function AuthorFormGroup({ submissionStatus, initialAuthorFields }: AuthorFormGroupProps) {
  const { t } = useTranslation('createDataset')
  const { multipleFields, setMultipleFields, addField, removeField } =
    useMultipleFields(initialAuthorFields)

  const isAuthorValid = (index: number) => {
    return !!multipleFields[index].authorName
  }
  const handleFieldChange = (index: number, event: FormEvent<FormInputElement>) => {
    const updatedAuthorFields = _.cloneDeep(multipleFields)
    updatedAuthorFields[index].authorName = (event.target as HTMLInputElement).value
    setMultipleFields(updatedAuthorFields)
  }

  return (
    <>
      {multipleFields.map((author, index) => (
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
                onChange={(event) => handleFieldChange(index, event)}
                isInvalid={!isAuthorValid(index)}
                value={author.authorName}
              />
              <Form.Group.Feedback type="invalid">
                {t('datasetForm.fields.authorName.feedback')}
              </Form.Group.Feedback>
            </Col>
            <Col sm={3}>
              <DynamicFieldsButtons
                originalField={index === 0}
                onAddButtonClick={() => {
                  addField(index, { authorName: '' })
                }}
                onRemoveButtonClick={() => {
                  removeField(index)
                }}
              />
            </Col>
          </Row>
        </Form.Group>
      ))}
    </>
  )
}
