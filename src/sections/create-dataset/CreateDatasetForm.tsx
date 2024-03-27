import { ChangeEvent, FormEvent, MouseEvent, useEffect } from 'react'
import { Form, Accordion, Alert, Button } from '@iqss/dataverse-design-system'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { useCreateDatasetForm, SubmissionStatus } from './useCreateDatasetForm'
import { useLoading } from '../loading/LoadingContext'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useDatasetFormData } from './useDatasetFormData'
import { Route } from '../Route.enum'
import { useDatasetValidator } from './useDatasetValidator'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
// import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'
import { MetadataBlockFormFields } from './MetadataBlockFormFields'
import { MetadataBlocksSkeleton } from './MetadataBlocksSkeleton'
import styles from './CreateDatasetForm.module.scss'

interface CreateDatasetFormProps {
  repository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function CreateDatasetForm({
  repository,
  metadataBlockInfoRepository
}: CreateDatasetFormProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('createDataset')
  const { isLoading, setIsLoading } = useLoading()
  const { metadataBlocks, isLoading: isLoadingMetadataBlocksToRender } = useGetMetadataBlocksInfo({
    metadataBlockInfoRepository,
    collectionId: 'someCollectionId', // TODO:ME Get collection id from url?
    mode: 'create'
  })
  const { validationErrors, datasetIsValid } = useDatasetValidator()
  const { formData, updateFormData } = useDatasetFormData(datasetIsValid)
  const { submissionStatus, submitForm } = useCreateDatasetForm(repository, datasetIsValid)

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    const value = event.target.type === 'checkbox' && !checked ? '' : event.target.value

    // updateFormData(name, value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const formData = Object.fromEntries(values)
    console.log(formData)

    // submitForm(formData)
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
          {/* METADATA BLOCKS */}
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
