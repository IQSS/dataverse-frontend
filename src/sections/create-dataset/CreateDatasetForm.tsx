import { ChangeEvent, FormEvent, MouseEvent, useEffect } from 'react'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { useCreateDatasetForm, SubmissionStatus } from './useCreateDatasetForm'
import styles from '/src/sections/dataset/Dataset.module.scss'
import { useLoading } from '../loading/LoadingContext'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useDatasetFormData } from './useDatasetFormData'
import { Route } from '../Route.enum'
import { useNavigate } from 'react-router-dom'

interface CreateDatasetFormProps {
  repository: DatasetRepository
}

export function CreateDatasetForm({ repository }: CreateDatasetFormProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('createDataset')
  const { isLoading, setIsLoading } = useLoading()
  const { formData, formDataErrors, updateFormData } = useDatasetFormData()
  const { submissionStatus, submitForm } = useCreateDatasetForm(repository)

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    updateFormData({ [name]: value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitForm(formData)
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(Route.HOME)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [isLoading])

  return (
    <article>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>
      <SeparationLine />
      <div className={styles.container}>
        <RequiredFieldText />
        {submissionStatus === SubmissionStatus.IsSubmitting && (
          <p>{t('datasetForm.status.submitting')}</p>
        )}
        {submissionStatus === SubmissionStatus.SubmitComplete && (
          <p>{t('datasetForm.status.success')}</p>
        )}
        {submissionStatus === SubmissionStatus.Errored && <p>{t('datasetForm.status.fail')}</p>}
        <Form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            handleSubmit(event)
          }}
          className={'create-dataset-form'}>
          <Row>
            <Col md={9}>
              <Form.Group controlId="createDatasetTitle" required>
                <Form.Group.Label>{t('datasetForm.title')}</Form.Group.Label>
                <Form.Group.Input
                  readOnly={submissionStatus === SubmissionStatus.IsSubmitting && true}
                  type="text"
                  name="title"
                  placeholder="Dataset Title"
                  onChange={handleFieldChange}
                  withinMultipleFieldsGroup={false}
                />
              </Form.Group>
              {formDataErrors.title && <span>{formDataErrors.title}</span>}
            </Col>
          </Row>
          <SeparationLine />
          <Alert variant={'info'} customHeading={t('metadataTip.title')} dismissible={false}>
            {t('metadataTip.content')}
          </Alert>
          <Button type="submit" disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
            {t('saveButton')}
          </Button>
          <Button withSpacing variant="secondary" type="button" onClick={handleCancel}>
            {t('cancelButton')}
          </Button>
        </Form>
      </div>
    </article>
  )
}
