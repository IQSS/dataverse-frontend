import React from 'react'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { RequiredFieldText } from '../../components/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../../components/layout/SeparationLine/SeparationLine'
import { useCreateDatasetForm, SubmissionStatusEnums } from './CreateDatasetContext'
import {
  FormValidationService,
  FormSubmissionService
} from '../../dataset/domain/useCases/createDataset'
import styles from '/src/sections/dataset/Dataset.module.scss'
interface FormPresenterProps {
  formValidationService: FormValidationService
  formSubmissionService: FormSubmissionService
}
export const CreateDatasetFormPresenter: React.FC<FormPresenterProps> = ({
  formValidationService,
  formSubmissionService
}: FormPresenterProps) => {
  const {
    formErrors,
    submissionStatus,
    handleCreateDatasetFieldChange,
    handleCreateDatasetSubmit
  } = useCreateDatasetForm({ formValidationService, formSubmissionService })

  const { t } = useTranslation('createDataset')

  return (
    <>
      <article>
        <header className={styles.header}>
          <h1>{t('pageTitle')}</h1>
        </header>
        <SeparationLine />
        <div className={styles.container}>
          <RequiredFieldText />
          {submissionStatus === SubmissionStatusEnums.IsSubmitting && <p>Submitting...</p>}
          {submissionStatus === SubmissionStatusEnums.SubmitComplete && (
            <p>Form submitted successfully!</p>
          )}
          {submissionStatus === SubmissionStatusEnums.Errored && <p>Error: Submission failed.</p>}
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
            <Button
              type="submit"
              disabled={submissionStatus === SubmissionStatusEnums.IsSubmitting}>
              {t('saveButton')}
            </Button>
            <Button withSpacing variant="secondary">
              {t('cancelButton')}
            </Button>
          </Form>
        </div>
      </article>
    </>
  )
}
