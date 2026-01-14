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
import { TemplateFieldInfo, TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { MetadataBlockName } from '@/dataset/domain/models/Dataset'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetMetadataBlocksInfo } from '@/sections/shared/form/DatasetMetadataForm/useGetMetadataBlocksInfo'
import { MetadataFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { MetadataBlockFormFields } from '@/sections/shared/form/DatasetMetadataForm/MetadataForm/MetadataBlockFormFields'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { RequiredFieldText } from '@/sections/shared/form/RequiredFieldText/RequiredFieldText'
import { RouteWithParams } from '@/sections/Route.enum'
import {
  TypeClassMetadataFieldOptions,
  type MetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { SubmissionStatus, useSubmitTemplate } from '@/sections/shared/form/useSubmitTemplate'
import { useGetTemplatesByCollectionId } from '@/dataset/domain/hooks/useGetTemplatesByCollectionId'
import styles from './CreateTemplate.module.scss'
import { CreateTemplateSkeleton } from './CreateTemplateSkeleton'

interface CreateTemplateProps {
  collectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  templateRepository: TemplateRepository
}

export const CreateTemplate = ({
  collectionId,
  collectionRepository,
  templateRepository,
  metadataBlockInfoRepository
}: CreateTemplateProps) => {
  const { t } = useTranslation('datasetTemplates')
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState<string | null>(null)
  const { submissionStatus, submitError, submitTemplate } = useSubmitTemplate(collectionId)
  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  const { datasetTemplates: templates, fetchDatasetTemplates } = useGetTemplatesByCollectionId({
    templateRepository,
    collectionIdOrAlias: collectionId
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

  const isLoadingData = isLoadingCollection || isLoadingMetadataBlocksInfoForEdit

  const errorLoadingData = errorLoadingMetadataBlocksInfoForEdit

  const metadataBlocksInfo = useMemo(
    () =>
      MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(
        metadataBlocksInfoForEdit
      ),
    [metadataBlocksInfoForEdit]
  )

  const citationBlock = useMemo(
    () => metadataBlocksInfo.find((block) => block.name === MetadataBlockName.CITATION),
    [metadataBlocksInfo]
  )

  const [templateName, setTemplateName] = useState('')
  const [navigateToTermsPending, setNavigateToTermsPending] = useState(false)

  const currentTemplateId = useMemo(() => {
    const normalizedName = templateName.trim().toLowerCase()
    if (!normalizedName) return null

    const match = templates.find(
      (template) => template.name.trim().toLowerCase() === normalizedName
    )
    return match?.id ?? null
  }, [templates, templateName])

  useEffect(() => {
    if (!navigateToTermsPending) return
    if (currentTemplateId === null) return

    setNavigateToTermsPending(false)
    navigate(RouteWithParams.TEMPLATES_EDIT_TERMS(collectionId, currentTemplateId), {
      state: { fromCreateTemplate: true }
    })
  }, [collectionId, currentTemplateId, navigate, navigateToTermsPending])

  const formDefaultValues = useMemo(
    () => MetadataFieldsHelper.getFormDefaultValues(citationBlock ? [citationBlock] : []),
    [citationBlock]
  )

  const form = useForm({ mode: 'onChange', defaultValues: formDefaultValues })

  useEffect(() => {
    form.reset(formDefaultValues)
  }, [form, formDefaultValues])

  const citationBlockForMapping = useMemo(
    () => metadataBlocksInfoForEdit.find((block) => block.name === MetadataBlockName.CITATION),
    [metadataBlocksInfoForEdit]
  )

  const metadataFieldsByName = useMemo(() => {
    const fieldMap = new Map<string, MetadataField>()

    const addFieldsToMap = (fields: Record<string, MetadataField>) => {
      Object.values(fields).forEach((field) => {
        fieldMap.set(field.name, field)
        if (field.childMetadataFields) {
          addFieldsToMap(field.childMetadataFields)
        }
      })
    }

    if (citationBlockForMapping?.metadataFields) {
      addFieldsToMap(citationBlockForMapping.metadataFields)
    }

    return fieldMap
  }, [citationBlockForMapping])

  type TemplateFieldValuePayload =
    | string
    | string[]
    | Record<
        string,
        {
          value: string | string[]
          typeName: string
          multiple: boolean
          typeClass: string
        }
      >
    | Array<
        Record<
          string,
          {
            value: string | string[]
            typeName: string
            multiple: boolean
            typeClass: string
          }
        >
      >

  const buildCompoundValues = (
    fieldInfo: ReturnType<typeof metadataFieldsByName.get>,
    fieldValue: unknown
  ): TemplateFieldValuePayload[] => {
    if (!fieldInfo || fieldInfo.typeClass !== TypeClassMetadataFieldOptions.Compound) {
      return []
    }
    const valueArray = Array.isArray(fieldValue) ? fieldValue : [fieldValue]
    const compoundValues: TemplateFieldValuePayload[] = []

    valueArray.forEach((compoundValue) => {
      if (!compoundValue || typeof compoundValue !== 'object' || Array.isArray(compoundValue)) {
        return
      }
      const entry: Record<
        string,
        {
          value: string | string[]
          typeName: string
          multiple: boolean
          typeClass: string
        }
      > = {}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.entries(compoundValue).forEach(([childName, childValue]) => {
        const childInfo = fieldInfo.childMetadataFields?.[childName]
        if (!childInfo) return
        if (childValue === '' || childValue === undefined || childValue === null) return

        entry[childInfo.name] = {
          value: childValue as string | string[],
          typeName: childInfo.name,
          multiple: childInfo.multiple,
          typeClass: childInfo.typeClass
        }
      })
      if (Object.keys(entry).length > 0) {
        compoundValues.push(entry)
      }
    })

    return compoundValues
  }

  const buildTemplateFields = (fieldValues: Record<string, unknown>): TemplateFieldInfo[] => {
    const templateFields: TemplateFieldInfo[] = []

    Object.entries(fieldValues).forEach(([fieldName, fieldValue]) => {
      const fieldInfo = metadataFieldsByName.get(fieldName)
      if (!fieldInfo) return

      if (
        fieldInfo.typeClass === TypeClassMetadataFieldOptions.Primitive ||
        fieldInfo.typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary
      ) {
        if (fieldValue === '' || fieldValue === undefined || fieldValue === null) return

        const valuePayload =
          fieldInfo.multiple && Array.isArray(fieldValue) ? fieldValue : (fieldValue as string)

        templateFields.push({
          typeName: fieldInfo.name,
          multiple: fieldInfo.multiple,
          typeClass: fieldInfo.typeClass,
          value: valuePayload as unknown as TemplateFieldInfo['value']
        })

        return
      }

      if (fieldInfo.typeClass === TypeClassMetadataFieldOptions.Compound) {
        const compoundValues = buildCompoundValues(fieldInfo, fieldValue)
        if (compoundValues.length === 0) return

        const valuePayload = fieldInfo.multiple ? compoundValues : compoundValues[0]

        templateFields.push({
          typeName: fieldInfo.name,
          multiple: fieldInfo.multiple,
          typeClass: fieldInfo.typeClass,
          value: valuePayload as unknown as TemplateFieldInfo['value']
        })
      }
    })

    return templateFields
  }

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <CreateTemplateSkeleton />
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

  const handleSaveAndAddTerms = () => {
    if (!templateName.trim()) {
      setValidationError(t('createTemplate.errors.nameRequired'))
      return
    }

    setValidationError(null)

    void form.handleSubmit(async (formValues) => {
      const formValuesBackToDots = MetadataFieldsHelper.replaceSlashKeysWithDot(formValues)
      const datasetDto = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
        formValuesBackToDots,
        'create'
      )
      const citationValues =
        datasetDto.metadataBlocks.find((block) => block.name === MetadataBlockName.CITATION)
          ?.fields ?? {}

      const templatePayload: TemplateInfo = {
        name: templateName.trim(),
        fields: buildTemplateFields(citationValues)
      }

      const didSubmit = await submitTemplate(templatePayload)
      if (!didSubmit) return

      await fetchDatasetTemplates()
      setNavigateToTermsPending(true)
    })()
  }

  return (
    <section className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTIONS(collectionId) }}>
          {collection.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTION_TEMPLATES(collectionId) }}>
          {t('pageTitle')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('createTemplate.breadcrumb')}</Breadcrumb.Item>
      </Breadcrumb>
      <header className={styles.header}>
        <h1>{t('createTemplate.pageTitle')}</h1>
      </header>
      {submissionStatus === SubmissionStatus.SubmitComplete && (
        <Alert variant="success" dismissible={false}>
          {t('createTemplate.alerts.success')}
        </Alert>
      )}
      {(validationError ?? submitError) && (
        <Alert variant="danger" dismissible={false}>
          {validationError ?? submitError}
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
                <MetadataBlockFormFields metadataBlock={citationBlock} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className={styles['form-actions']}>
            <Button
              type="button"
              onClick={handleSaveAndAddTerms}
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
              {t('createTemplate.saveAddTerms')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              withSpacing
              onClick={() => navigate(RouteWithParams.COLLECTION_TEMPLATES(collectionId))}>
              {t('createTemplate.cancel')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  )
}
