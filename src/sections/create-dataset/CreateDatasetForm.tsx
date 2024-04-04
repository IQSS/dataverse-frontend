import { ChangeEvent, MouseEvent, useEffect } from 'react'
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
// import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'
import { MetadataBlockFormFields } from './MetadataBlockFormFields'
import { MetadataBlocksSkeleton } from './MetadataBlocksSkeleton'
import styles from './CreateDatasetForm.module.scss'

interface CreateDatasetFormProps {
  repository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

// TODO:ME: Check validations for each field type, search on JSF version and check if can be implemented here
// TODO:ME: Dont add alerts, they are done in another issue
// TODO:ME: Ask GP how backend need to receive the data, check guides first

export function CreateDatasetForm({
  repository,
  metadataBlockInfoRepository
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
    collectionId: 'someCollectionId', // TODO:ME Get collection id from url?
    mode: 'create'
  })
  const isErrorLoadingMetadataBlocksToRender = Boolean(errorLoadingMetadataBlocksToRender)
  const { submissionStatus, submitForm } = useCreateDatasetForm(repository)

  console.log(submissionStatus)

  const form = useForm({
    mode: 'onChange'
  })

  // console.log('dirtyFields: ', form.formState.dirtyFields)
  // console.log('errors: ', form.formState.errors)
  // console.log('isDirty: ', form.formState.isDirty)

  const handleFieldChange = <T extends HTMLElement>(event: ChangeEvent<T>) => {
    // Cast event.target to HTMLInputElement or HTMLSelectElement or HTMLTextAreaElement
    const target = event.target as unknown as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    const { name: _name, type } = target
    const _value = type === 'checkbox' && 'checked' in target && !target.checked ? '' : target.value

    // updateFormData(name, value)
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(Route.HOME)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [isLoading])

  return (
    <FormProvider {...form}>
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
          {/* 
        {submissionStatus === SubmissionStatus.SubmitComplete && (
          <p>{t('datasetForm.status.success')}</p>
        )}
        {submissionStatus === SubmissionStatus.Errored && <p>{t('datasetForm.status.failed')}</p>} */}
          <Form onSubmit={form.handleSubmit(submitForm)}>
            {/* METADATA BLOCKS */}
            {isLoadingMetadataBlocksToRender && <MetadataBlocksSkeleton />}
            {!isLoadingMetadataBlocksToRender && metadataBlocks.length > 0 && (
              <Accordion defaultActiveKey="0" data-testid="metadatablocks-accordion">
                {metadataBlocks.map((metadataBlock, index) => (
                  <Accordion.Item eventKey={index.toString()} key={metadataBlock.id}>
                    <Accordion.Header>{metadataBlock.displayName}</Accordion.Header>
                    <Accordion.Body>
                      <MetadataBlockFormFields
                        metadataBlock={metadataBlock}
                        onChangeField={handleFieldChange}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}

            <SeparationLine />
            <Alert variant={'info'} customHeading={t('metadataTip.title')} dismissible={false}>
              {t('metadataTip.content')}
            </Alert>
            <Button
              type="submit"
              disabled={isErrorLoadingMetadataBlocksToRender || isLoadingMetadataBlocksToRender}
              // disabled={submissionStatus === SubmissionStatus.IsSubmitting}
            >
              {t('saveButton')}
            </Button>
            <Button withSpacing variant="secondary" type="button" onClick={handleCancel}>
              {t('cancelButton')}
            </Button>
          </Form>
        </div>
      </article>
    </FormProvider>
  )
}
