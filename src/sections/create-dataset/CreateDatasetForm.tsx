import { MouseEvent, useEffect, useMemo } from 'react'
import { Form, Accordion, Alert, Button } from '@iqss/dataverse-design-system'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { useCreateDatasetForm, SubmissionStatus } from './useCreateDatasetForm'
import { useLoading } from '../loading/LoadingContext'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { Route } from '../Route.enum'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { MetadataBlockFormFields } from './MetadataBlockFormFields'
import { MetadataBlocksSkeleton } from './MetadataBlocksSkeleton'
import styles from './CreateDatasetForm.module.scss'

interface CreateDatasetFormProps {
  repository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId?: string
}

export function CreateDatasetForm({
  repository,
  metadataBlockInfoRepository,
  collectionId = 'root'
}: CreateDatasetFormProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('createDataset')
  const { isLoading, setIsLoading } = useLoading()
  const {
    metadataBlocks,
    isLoading: isLoadingMetadataBlocksToRender,
    error: errorLoadingMetadataBlocksToRender
  } = useGetMetadataBlocksInfo({
    metadataBlockInfoRepository,
    collectionId,
    mode: 'create'
  })

  const isErrorLoadingMetadataBlocksToRender = Boolean(errorLoadingMetadataBlocksToRender)
  const { submissionStatus, submitForm } = useCreateDatasetForm(repository)

  const form = useForm({ mode: 'onChange' })

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(Route.HOME)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [isLoading])

  const disableSubmitButton = useMemo(() => {
    return (
      isErrorLoadingMetadataBlocksToRender ||
      isLoadingMetadataBlocksToRender ||
      submissionStatus === SubmissionStatus.IsSubmitting
    )
  }, [isErrorLoadingMetadataBlocksToRender, isLoadingMetadataBlocksToRender, submissionStatus])

  return (
    <article>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>
      <SeparationLine />

      <div className={styles.container}>
        <RequiredFieldText />
        {isErrorLoadingMetadataBlocksToRender && (
          <Alert variant="danger" dismissible={false}>
            {errorLoadingMetadataBlocksToRender}
          </Alert>
        )}
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

        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(submitForm)}>
            {isLoadingMetadataBlocksToRender && <MetadataBlocksSkeleton />}
            {!isLoadingMetadataBlocksToRender && metadataBlocks.length > 0 && (
              <Accordion defaultActiveKey="0" data-testid="metadatablocks-accordion">
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
    </article>
  )
}
