import { ChangeEvent, FormEvent, MouseEvent, useEffect } from 'react'
import { Alert, Button, Form } from '@iqss/dataverse-design-system'
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
import { useDatasetValidator } from './useDatasetValidator'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'

interface CreateDatasetFormProps {
  repository: DatasetRepository
}

export function CreateDatasetForm({ repository }: CreateDatasetFormProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('createDataset')
  const { isLoading, setIsLoading } = useLoading()
  const { validationErrors, datasetIsValid } = useDatasetValidator()
  const { formData, updateFormData } = useDatasetFormData(datasetIsValid)
  const { submissionStatus, submitForm } = useCreateDatasetForm(repository, datasetIsValid)

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    updateFormData(name, value)
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
        {submissionStatus === SubmissionStatus.Errored && <p>{t('datasetForm.status.failed')}</p>}
        <Form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            handleSubmit(event)
          }}>
          <Form.Group controlId="dataset-title" required>
            <Form.Group.Label message={t('datasetForm.fields.title.tooltip')}>
              {t('datasetForm.fields.title.label')}
            </Form.Group.Label>
            <Form.Group.Input
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}
              type="text"
              name="metadataBlocks.0.fields.title"
              onChange={handleFieldChange}
              isInvalid={!!validationErrors.metadataBlocks[0].fields.title}
            />
            <Form.Group.Feedback type="invalid">
              {t('datasetForm.fields.title.feedback')}
            </Form.Group.Feedback>
          </Form.Group>
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
          <Form.Group controlId="description-text" required>
            <Form.Group.Label message={t('datasetForm.fields.dsDescriptionValue.tooltip')}>
              {t('datasetForm.fields.dsDescriptionValue.label')}
            </Form.Group.Label>
            <Form.Group.Input
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}
              type="text"
              name="metadataBlocks.0.fields.dsDescription.0.dsDescriptionValue"
              onChange={handleFieldChange}
              isInvalid={
                !!(
                  validationErrors.metadataBlocks[0].fields
                    .dsDescription as DatasetMetadataSubField[]
                )[0].dsDescriptionValue
              }
            />
            <Form.Group.Feedback type="invalid">
              {t('datasetForm.fields.dsDescriptionValue.feedback')}
            </Form.Group.Feedback>
          </Form.Group>
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
