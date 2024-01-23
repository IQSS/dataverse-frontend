import { ChangeEvent, FormEvent } from 'react'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { useCreateDatasetForm, SubmissionStatusEnums } from './useCreateDatasetForm'
import styles from '/src/sections/dataset/Dataset.module.scss'

export function CreateDatasetForm() {
  const { formErrors, submissionStatus, updateFormData, submitFormData } = useCreateDatasetForm()

  const { t } = useTranslation('createDataset')

  const handleCreateDatasetFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    updateFormData({ [name]: value })
  }

  const handleCreateDatasetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitFormData()
  }

  return (
    <article>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>
      <SeparationLine />
      <div className={styles.container}>
        <RequiredFieldText />
        {submissionStatus === SubmissionStatusEnums.IsSubmitting && (
          <p>{t('datasetForm.status.submitting')}</p>
        )}
        {submissionStatus === SubmissionStatusEnums.SubmitComplete && (
          <p>{t('datasetForm.status.success')}</p>
        )}
        {submissionStatus === SubmissionStatusEnums.Errored && (
          <p>{t('datasetForm.status.fail')}</p>
        )}
        <Form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            handleCreateDatasetSubmit(event)
          }}
          className={'create-dataset-form'}>
          <Row>
            <Col md={9}>
              <Form.Group controlId="createDatasetTitle" required>
                <Form.Group.Label>{t('datasetForm.title')}</Form.Group.Label>
                <Form.Group.Input
                  readOnly={submissionStatus === SubmissionStatusEnums.IsSubmitting && true}
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
          <Button type="submit" disabled={submissionStatus === SubmissionStatusEnums.IsSubmitting}>
            {t('saveButton')}
          </Button>
          <Button withSpacing variant="secondary">
            {t('cancelButton')}
          </Button>
        </Form>
      </div>
    </article>
  )
}
