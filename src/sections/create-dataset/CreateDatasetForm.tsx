/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { RequiredFieldText } from '../../components/forms/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../../components/layout/SeparationLine/SeparationLine'
import { useDataset } from './CreateDatasetContext'
import { FormInputElement } from '@iqss/dataverse-design-system/src/lib/components/form/form-group/form-element/FormInput'

/*
 * TODO:
 * out-of-scope: Find submit action source
 * out-of-scope: Loading state management
 */

const CreateDatasetFormPresenter: React.FC = () => {
  const { t } = useTranslation('createDataset')
  const [formData, setFormData] = useState({ createDatasetTitle: '' })
  const { submitDataset, validateCreateDatasetFormData } = useDataset()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleCreateDatasetFieldChange = (event: React.ChangeEvent<FormInputElement>): void => {
    const { name, value } = event.target
    setFormData((formData) => ({
      ...formData,
      [name]: value
    }))
  }

  const handleCreateDatasetSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitSuccess(false)
    if (validateCreateDatasetFormData(formData)) {
      setIsSubmitting(true)
      try {
        await submitDataset(formData)
        // setFormData({ createDatasetTitle: '') // Reset form fields
        setSubmitSuccess(true)
      } catch (error) {
        console.error('Error during submission:', error)
        // Optionally handle the error state here
      } finally {
        setIsSubmitting(false)
      }
    } else {
      console.error('Validation failed: Title is required.')
      // Optionally handle the validation error state here
    }
  }

  return (
    <>
      <RequiredFieldText />
      <Form onSubmit={handleCreateDatasetSubmit} className={'create-dataset-form'}>
        {submitSuccess && <div>Form Submitted!</div>}
        <Row>
          <Col md={9}>
            <Form.Group controlId="createDatasetTitle" required>
              <Form.Group.Label>{t('datasetForm.title')}</Form.Group.Label>
              <Form.Group.Input
                readOnly={isSubmitting && true}
                type="text"
                name="createDatasetTitle"
                placeholder="Dataset Title"
                onChange={handleCreateDatasetFieldChange}
                withinMultipleFieldsGroup={false}
              />
            </Form.Group>
          </Col>
        </Row>
        <SeparationLine />
        <Alert variant={'info'} customHeading={t('metadataTip.title')} dismissible={false}>
          {t('metadataTip.content')}
        </Alert>
        <Button type="submit">{t('saveButton')}</Button>
        <Button withSpacing variant="secondary">
          {t('cancelButton')}
        </Button>
      </Form>
    </>
  )
}
export default CreateDatasetFormPresenter
