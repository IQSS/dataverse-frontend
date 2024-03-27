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
    const { name, checked } = event.target
    const value = event.target.type === 'checkbox' && !checked ? '' : event.target.value

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
        {submissionStatus === SubmissionStatus.Errored && (
          <Alert variant={'danger'} customHeading={t('validationAlert.title')} dismissible={false}>
            {t('validationAlert.content')}
          </Alert>
        )}
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
          <Form.Group controlId="contact-email" required>
            <Form.Group.Label message={t('datasetForm.fields.datasetContactEmail.tooltip')}>
              {t('datasetForm.fields.datasetContactEmail.label')}
            </Form.Group.Label>
            <Form.Group.Input
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}
              type="email"
              name="metadataBlocks.0.fields.datasetContact.0.datasetContactEmail"
              onChange={handleFieldChange}
              isInvalid={
                !!(
                  validationErrors.metadataBlocks[0].fields
                    .datasetContact as DatasetMetadataSubField[]
                )[0].datasetContactEmail
              }
            />
            <Form.Group.Feedback type="invalid">
              {t('datasetForm.fields.datasetContactEmail.feedback')}
            </Form.Group.Feedback>
          </Form.Group>
          <Form.Group controlId="description-text" required>
            <Form.Group.Label message={t('datasetForm.fields.dsDescriptionValue.tooltip')}>
              {t('datasetForm.fields.dsDescriptionValue.label')}
            </Form.Group.Label>
            <Form.Group.TextArea
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}
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
          <Form.CheckboxGroup
            title={t('datasetForm.fields.subject.label')}
            required
            message={t('datasetForm.fields.subject.tooltip')}
            isInvalid={!!(validationErrors.metadataBlocks[0].fields.subject as string[])[0]}>
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.0"
              label="Agricultural Sciences"
              id="subject-agricultural-sciences"
              value="Agricultural Sciences"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.1"
              label="Arts and Humanities"
              id="subject-arts-and-humanities"
              value="Arts and Humanities"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.2"
              label="Astronomy and Astrophysics"
              id="subject-astronomy-and-astrophysics"
              value="Astronomy and Astrophysics"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.3"
              label="Business and Management"
              id="subject-business-and-management"
              value="Business and Management"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.4"
              label="Chemistry"
              id="subject-chemistry"
              value="Chemistry"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.5"
              label="Computer and Information Science"
              id="subject-computer-and-information-science"
              value="Computer and Information Science"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.6"
              label="Earth and Environmental Sciences"
              id="subject-earth-and-environmental-sciences"
              value="Earth and Environmental Sciences"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.7"
              label="Engineering"
              id="subject-engineering"
              value="Engineering"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.8"
              label="Law"
              id="subject-law"
              value="Law"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.9"
              label="Mathematical Sciences"
              id="subject-mathematical-sciences"
              value="Mathematical Sciences"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.10"
              label="Medicine, Health and Life Sciences"
              id="subject-medicine-health-and-life-sciences"
              value="Medicine, Health and Life Sciences"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.11"
              label="Physics"
              id="subject-physics"
              value="Physics"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.12"
              label="Social Sciences"
              id="subject-social-sciences"
              value="Social Sciences"
              onChange={handleFieldChange}
            />
            <Form.Group.Checkbox
              name="metadataBlocks.0.fields.subject.13"
              label="Other"
              id="subject-other"
              value="Other"
              onChange={handleFieldChange}
            />
            <Form.Group.Feedback type="invalid" withinMultipleFieldsGroup>
              {t('datasetForm.fields.subject.feedback')}
            </Form.Group.Feedback>
          </Form.CheckboxGroup>
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
