import React, { FormEvent, ChangeEvent, useState } from 'react'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { RequiredFieldText } from '../../components/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../../components/layout/SeparationLine/SeparationLine'
import { useFormContext } from './CreateDatasetContext'
import {
  CreateDatasetFormFields,
  FormValidationService,
  FormValidationResult
} from '../../dataset/domain/useCases/createDataset'
import { FormSubmissionService } from '../../dataset/domain/useCases/createDataset'

type CreateDatasetFormProps = {
  formValidationService: FormValidationService
  formSubmissionService: FormSubmissionService
}

enum SubmissionStatus {
  Unsubmitted,
  Submitted,
  Errored
}

export const CreateDatasetFormPresenter: React.FC<CreateDatasetFormProps> = ({
  formValidationService,
  formSubmissionService
}) => {
  const { formState, updateFormState } = useFormContext()
  const [submissionStatus, setSubmissionStatus] = React.useState<SubmissionStatus>(
    SubmissionStatus.Unsubmitted
  )
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<
    Record<keyof CreateDatasetFormFields, string | undefined>
  >({
    createDatasetTitle: undefined
  })
  const { t } = useTranslation('createDataset')

  const handleCreateDatasetFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    updateFormState({ ...formState, [name]: value })
  }

  const handleCreateDatasetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus(SubmissionStatus.Unsubmitted)

    const validationResult: FormValidationResult = formValidationService.validateForm(formState)

    if (validationResult.isValid) {
      formSubmissionService
        .submitFormData(formState)
        .then(() => setSubmissionStatus(SubmissionStatus.Submitted))
        .catch(() => setSubmissionStatus(SubmissionStatus.Errored))
        .finally(() => setIsSubmitting(false))
    } else {
      setFormErrors(validationResult.errors)
      setSubmissionStatus(SubmissionStatus.Errored)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <RequiredFieldText />
      {isSubmitting && <p>Submitting...</p>}
      {submissionStatus === SubmissionStatus.Submitted && <p>Form submitted successfully!</p>}
      {submissionStatus === SubmissionStatus.Errored && <p>Error: Submission failed.</p>}
      <Form
        onSubmit={(event) => {
          handleCreateDatasetSubmit(event)
        }}
        className={'create-dataset-form'}>
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
            {formErrors.createDatasetTitle && <span>{formErrors.createDatasetTitle}</span>}
          </Col>
        </Row>
        <SeparationLine />
        <Alert variant={'info'} customHeading={t('metadataTip.title')} dismissible={false}>
          {t('metadataTip.content')}
        </Alert>
        <Button type="submit" disabled={isSubmitting}>
          {t('saveButton')}
        </Button>
        <Button withSpacing variant="secondary">
          {t('cancelButton')}
        </Button>
      </Form>
    </>
  )
}
