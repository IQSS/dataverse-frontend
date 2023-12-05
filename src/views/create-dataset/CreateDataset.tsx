import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useDataset } from '../../sections/dataset/DatasetContext'
import { DatasetSkeleton } from '../../sections/dataset/DatasetSkeleton'
import { useLoading } from '../../sections/loading/LoadingContext'
import styles from '/src/sections/dataset/Dataset.module.scss'
import { FormInputElement } from '@iqss/dataverse-design-system/src/lib/components/form/form-group/form-element/FormInput'
import { SeparationLine } from '../../components/ui/SeparationLine/SeparationLine'
import { RequiredFieldText } from '../../components/Forms/RequiredFieldText/RequiredFieldText'

/*
 * TODO:
 * Break out different components
 * Find submit action source
 * cleanup state objects and submit process
 * show submitted info in console
 */

// See comments about https://rjsf-team.github.io/react-jsonschema-form/
// https://github.com/IQSS/dataverse-frontend/issues/231

export function CreateDataset() {
  const { setIsLoading } = useLoading()
  const { isLoading } = useDataset()
  const { t } = useTranslation('createDataset')
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(false)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  const [state, setState] = useState({
    createDatasetTitle: ''
  })

  const handleCreateDatasetFieldChange = (e: ChangeEvent<FormInputElement>) => {
    let value: (typeof state)[keyof typeof state] = e.target.value
    if (e.target.type === 'text') {
      value = e.target.value
    }

    setState({ ...state, [e.target.id]: value })
  }

  // TODO: Connect to API when ready
  const handleCreateDatasetSubmit = (event: FormEvent<HTMLFormElement>) => {
    setSubmitting(true)
    event.preventDefault()
    setTimeout(() => {
      setSubmitting(false)
      console.log('Form Submitted!')
      setSubmitStatus(true)
    }, 3000)
    console.log(state)
    // TODO: Callback for form submission should be here.
  }

  // TODO: Probably replace this with a FormSkeleton or remove entirely
  if (isLoading) {
    return <DatasetSkeleton />
  }
  return (
    <article>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>
      <SeparationLine />
      <div className={styles.container}>
        <RequiredFieldText />
        {submitting && <div>Submtting Form...</div>}
        <Form onSubmit={handleCreateDatasetSubmit}>
          {submitStatus && <div>Form Submitted!</div>}
          <Row>
            <Col md={9}>
              <Form.Group controlId="createDatasetTitle" required>
                <Form.Group.Label>{t('datasetForm.title')}</Form.Group.Label>
                <Form.Group.Input
                  data-cy="datasetFormInputTitle"
                  type="text"
                  placeholder="Dataset Title"
                  onChange={handleCreateDatasetFieldChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <SeparationLine />
          <Alert
            key={1}
            variant={'info'}
            customHeading={t('metadataTip.title')}
            dismissible={false}>
            {t('metadataTip.content')}
          </Alert>
          {/* SRC: https://github.com/IQSS/dataverse/blob/develop/src/main/webapp/dataset.xhtml */}
          {/* <p:commandButton id="saveBottom" styleClass="btn btn-default" value="#{DatasetPage.editMode == 'CREATE' ? bundle['file.addBtn'] : bundle.saveChanges}" rendered="#{DatasetPage.editMode == 'CREATE' or DatasetPage.editMode == 'METADATA'}"
              onclick="PF('blockDatasetForm').show();"
              update=":datasetForm,:messagePanel"
              oncomplete="$(document).scrollTop(0);"
              action="#{DatasetPage.save}"
              /> */}
          {/* Where is datasetSaveCommand()  */}
          {/* <p:remoteCommand
            name="datasetSaveCommand"
            action="#{DatasetPage.save()}"
            update=":datasetForm,:messagePanel"
          /> */}
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
