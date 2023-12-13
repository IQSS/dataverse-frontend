// components/FormPresenter.tsx

import { ChangeEvent, FormEvent } from 'react'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import styles from '/src/sections/dataset/Dataset.module.scss'
import { SeparationLine } from '../../components/ui/SeparationLine/SeparationLine'
import { RequiredFieldText } from '../../components/Forms/RequiredFieldText/RequiredFieldText'

/*
 * TODO:
 * out-of-scope: Find submit action source
 * out-of-scope: Loading state management
 */

interface CreateDatasetFormPresenterProps {
  formData: { createDatasetTitle: string }
  handleCreateDatasetFieldChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleCreateDatasetSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitting: boolean
  submitComplete: boolean
}
export default function CreateDatasetFormPresenter({
  handleCreateDatasetFieldChange,
  handleCreateDatasetSubmit,
  submitting,
  submitComplete
}: CreateDatasetFormPresenterProps) {
  const { t } = useTranslation('createDataset')
  // TODO: Probably replace this with a FormSkeleton or remove entirely
  // if (loading) {
  //   return <DatasetSkeleton />
  // }
  return (
    <article>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>
      <SeparationLine />
      <div className={styles.container} id="foo">
        <RequiredFieldText />
        <Form onSubmit={handleCreateDatasetSubmit} className={'create-dataset-form'}>
          {submitComplete && <div>Form Submitted!</div>}
          <Row>
            <Col md={9}>
              <Form.Group controlId="createDatasetTitle" required>
                <Form.Group.Label>{t('datasetForm.title')}</Form.Group.Label>
                <Form.Group.Input
                  readOnly={submitting && true}
                  data-cy="datasetFormInputTitle"
                  type="text"
                  // FIX: Err - Property 'name' does not exist on type 'IntrinsicAttributes & FormInputProps'.
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
          <Button type="submit" data-cy="datasetFormSubmit">
            {t('saveButton')}
          </Button>
          <Button withSpacing variant="secondary" data-cy="datasetFormCancel">
            {t('cancelButton')}
          </Button>
        </Form>
      </div>
    </article>
  )
}
