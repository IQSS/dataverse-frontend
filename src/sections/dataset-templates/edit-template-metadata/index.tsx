// waiting to be implemented till Edit Template api support is ready

import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Accordion,
  Alert,
  Button,
  Breadcrumb,
  Col,
  Form,
  RequiredInputSymbol
} from '@iqss/dataverse-design-system'
import { MetadataBlockName } from '@/dataset/domain/models/Dataset'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useGetMetadataBlocksInfo } from '@/sections/shared/form/DatasetMetadataForm/useGetMetadataBlocksInfo'
import { useGetTemplate } from '@/dataset/domain/hooks/useGetTemplate'
import { MetadataFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { MetadataBlockFormFields } from '@/sections/shared/form/DatasetMetadataForm/MetadataForm/MetadataBlockFormFields'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { RequiredFieldText } from '@/sections/shared/form/RequiredFieldText/RequiredFieldText'
import { RouteWithParams } from '@/sections/Route.enum'
import { EditDatasetTemplateMetadataSkeleton } from './EditDatasetTemplateMetadataSkeleton'
import styles from '../create-template/CreateDatasetTemplate.module.scss'

interface EditDatasetTemplateMetadataProps {
  collectionId: string
  templateId: number
  collectionRepository: CollectionRepository
  templateRepository: TemplateRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export const EditDatasetTemplateMetadata = ({
  collectionId,
  templateId,
  collectionRepository,
  templateRepository,
  metadataBlockInfoRepository
}: EditDatasetTemplateMetadataProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { t: tShared } = useTranslation('shared')
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState<string | null>(null)
  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  const { template, isLoadingTemplate, errorGetTemplate } = useGetTemplate({
    templateRepository,
    templateId
  })

  const {
    metadataBlocksInfo: metadataBlocksInfoForEdit,
    isLoading: isLoadingMetadataBlocksInfoForEdit,
    error: errorLoadingMetadataBlocksInfoForEdit
  } = useGetMetadataBlocksInfo({
    mode: 'edit',
    collectionId,
    metadataBlockInfoRepository
  })

  const isLoadingData =
    isLoadingCollection || isLoadingMetadataBlocksInfoForEdit || isLoadingTemplate

  const errorLoadingData = errorLoadingMetadataBlocksInfoForEdit ?? errorGetTemplate

  const metadataBlocksInfo = useMemo(() => {
    const normalizedMetadataBlocksInfo =
      MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfoForEdit)

    if (!template) {
      return normalizedMetadataBlocksInfo
    }

    const datasetMetadataBlocks = MetadataFieldsHelper.replaceDatasetMetadataBlocksDotKeysWithSlash(
      template.datasetMetadataBlocks
    )

    return MetadataFieldsHelper.addFieldValuesToMetadataBlocksInfo(
      normalizedMetadataBlocksInfo,
      datasetMetadataBlocks
    )
  }, [metadataBlocksInfoForEdit, template])

  const citationBlock = useMemo(
    () => metadataBlocksInfo.find((block) => block.name === MetadataBlockName.CITATION),
    [metadataBlocksInfo]
  )

  const [templateName, setTemplateName] = useState('')

  useEffect(() => {
    if (template?.name) {
      setTemplateName(template.name)
    }
  }, [template])

  const formDefaultValues = useMemo(
    () => MetadataFieldsHelper.getFormDefaultValues(citationBlock ? [citationBlock] : []),
    [citationBlock]
  )

  const form = useForm({ mode: 'onChange', defaultValues: formDefaultValues })

  useEffect(() => {
    form.reset(formDefaultValues)
  }, [form, formDefaultValues])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData) {
    return <EditDatasetTemplateMetadataSkeleton />
  }

  if (errorLoadingData) {
    return (
      <Alert variant="danger" dismissible={false}>
        {errorLoadingData}
      </Alert>
    )
  }

  if (!citationBlock) {
    return (
      <Alert variant="danger" dismissible={false}>
        {t('createTemplate.citationMissing')}
      </Alert>
    )
  }

  return (
    <>
      <section className={styles.container}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: RouteWithParams.COLLECTIONS(collectionId) }}>
            {collection?.name}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: RouteWithParams.COLLECTION_TEMPLATES(collectionId) }}>
            {t('pageTitle')}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{t('actions.edit')}</Breadcrumb.Item>
        </Breadcrumb>
        <header className={styles.header}>
          <h1>{t('actions.edit')}</h1>
        </header>
        {validationError && (
          <Alert variant="danger" dismissible={false}>
            {validationError}
          </Alert>
        )}
        <FormProvider {...form}>
          <form noValidate={true}>
            <Form.Group className={styles['template-name-row']} controlId="template-name">
              <Form.Group.Label column sm={3}>
                {t('createTemplate.templateName')}
                <RequiredInputSymbol />
              </Form.Group.Label>
              <Col sm={9}>
                <Form.Group.Input
                  type="text"
                  required
                  isInvalid={Boolean(validationError)}
                  value={templateName}
                  onChange={(event) => {
                    const nextValue = event.target.value
                    setTemplateName(nextValue)
                    if (validationError && nextValue.trim()) {
                      setValidationError(null)
                    }
                  }}
                />
                {validationError && (
                  <Form.Group.Feedback type="invalid">{validationError}</Form.Group.Feedback>
                )}
              </Col>
            </Form.Group>
            <RequiredFieldText />
            <Accordion defaultActiveKey="0" className={styles.accordion}>
              <Accordion.Item eventKey="0" id={`metadata-block-item-${citationBlock.name}`}>
                <Accordion.Header>{citationBlock.displayName}</Accordion.Header>
                <Accordion.Body>
                  <MetadataBlockFormFields
                    metadataBlock={citationBlock}
                    datasetTemplateInstructions={template?.instructions}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div className={styles['form-actions']}>
              <Button type="button" disabled>
                {tShared('saveChanges')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                withSpacing
                onClick={() => navigate(RouteWithParams.COLLECTION_TEMPLATES(collectionId))}>
                {tShared('cancel')}
              </Button>
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  )
}
