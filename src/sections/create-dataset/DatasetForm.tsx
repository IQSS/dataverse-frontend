import { MouseEvent, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus, useCreateDatasetForm } from './useCreateDatasetForm'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfo } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type CreateDatasetFormValues } from './MetadataFieldsHelper'
import { Form, Accordion, Alert, Button } from '@iqss/dataverse-design-system'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { MetadataBlockFormFields } from './MetadataBlockFormFields'
import { Route } from '../Route.enum'

interface DatasetFormProps {
  repository: DatasetRepository
  metadataBlocks: MetadataBlockInfo[]
  errorLoadingMetadataBlocks: string | null
  formDefaultValues: CreateDatasetFormValues
}

export const DatasetForm = ({
  repository,
  metadataBlocks,
  errorLoadingMetadataBlocks,
  formDefaultValues
}: DatasetFormProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('createDataset')

  const { submissionStatus, submitForm } = useCreateDatasetForm(repository)

  const isErrorLoadingMetadataBlocks = Boolean(errorLoadingMetadataBlocks)

  const form = useForm({
    mode: 'onChange',
    defaultValues: formDefaultValues
  })
  // console.group('form')
  // console.log(form.getValues())
  // console.log(form.watch('citation.subject'))
  // console.groupEnd()

  const formHasErrors = Object.keys(form.formState.errors).length > 0

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(Route.HOME)
  }

  const disableSubmitButton = useMemo(() => {
    return isErrorLoadingMetadataBlocks || submissionStatus === SubmissionStatus.IsSubmitting
  }, [isErrorLoadingMetadataBlocks, submissionStatus])

  return (
    <div>
      <RequiredFieldText />
      {isErrorLoadingMetadataBlocks && (
        <Alert variant="danger" dismissible={false}>
          {errorLoadingMetadataBlocks}
        </Alert>
      )}
      {submissionStatus === SubmissionStatus.IsSubmitting && (
        <p>{t('datasetForm.status.submitting')}</p>
      )}

      {submissionStatus === SubmissionStatus.SubmitComplete && (
        <p>{t('datasetForm.status.success')}</p>
      )}
      {(submissionStatus === SubmissionStatus.Errored || formHasErrors) && (
        <Alert variant={'danger'} customHeading={t('validationAlert.title')} dismissible={false}>
          {t('validationAlert.content')}
        </Alert>
      )}

      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(submitForm)}>
          {/* TODO:ME Open accordion with error inputs when submitting */}
          {metadataBlocks.length > 0 && (
            <Accordion defaultActiveKey="0">
              {metadataBlocks.map((metadataBlock, index) => (
                <Accordion.Item eventKey={index.toString()} key={metadataBlock.id}>
                  <Accordion.Header>{metadataBlock.displayName}</Accordion.Header>
                  <Accordion.Body>
                    <MetadataBlockFormFields metadataBlock={metadataBlock} />
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}

          <SeparationLine />
          <Alert variant={'info'} customHeading={t('metadataTip.title')} dismissible={false}>
            {t('metadataTip.content')}
          </Alert>
          <Button type="submit" disabled={disableSubmitButton}>
            {t('saveButton')}
          </Button>
          <Button
            withSpacing
            variant="secondary"
            type="button"
            onClick={handleCancel}
            disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
            {t('cancelButton')}
          </Button>
        </Form>
      </FormProvider>
    </div>
  )
}
