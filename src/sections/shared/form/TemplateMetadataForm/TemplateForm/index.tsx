import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Accordion,
  Alert,
  Button,
  Col,
  Form,
  RequiredInputSymbol
} from '@iqss/dataverse-design-system'
import {
  type MetadataBlockInfo,
  type MetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  MetadataFieldsHelper,
  type DatasetMetadataFormValues
} from '../../DatasetMetadataForm/MetadataFieldsHelper'
import { MetadataBlockFormFields } from '../../DatasetMetadataForm/MetadataForm/MetadataBlockFormFields'
import { RequiredFieldText } from '../../RequiredFieldText/RequiredFieldText'
import { RouteWithParams, TemplateEditMode } from '@/sections/Route.enum'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/templates/domain/models/Template'
import { useGetTemplatesByCollectionId } from '@/templates/domain/hooks/useGetTemplatesByCollectionId'
import { SubmissionStatus, useSubmitTemplate } from '../useSubmitTemplate'
import { TemplateInfo, TemplateInstructionInfo } from '@/templates/domain/models/TemplateInfo'
import { UpdateTemplateMetadataInfo } from '@/templates/domain/models/UpdateTemplateMetadataInfo'
import styles from './index.module.scss'

type CommonTemplateFormProps = {
  collectionId: string
  templateRepository: TemplateRepository
  metadataBlocksInfo: MetadataBlockInfo[]
  formDefaultValues: DatasetMetadataFormValues
  metadataFieldsForMapping: Record<string, Record<string, MetadataField>>
}

type TemplateFormProps =
  | (CommonTemplateFormProps & {
      mode: 'create'
      template?: never
    })
  | (CommonTemplateFormProps & {
      mode: 'edit'
      template: Template
    })

export const TemplateForm = (props: TemplateFormProps) => {
  const {
    mode,
    collectionId,
    templateRepository,
    metadataBlocksInfo,
    formDefaultValues,
    metadataFieldsForMapping
  } = props
  const template = mode === 'edit' ? props.template : undefined

  const { t } = useTranslation('datasetTemplates')
  const { t: tShared } = useTranslation('shared')
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState(template?.name ?? '')

  const initialInstructionsMap = useMemo<Record<string, TemplateInstructionInfo>>(() => {
    if (!template?.instructions) return {}
    return template.instructions.reduce<Record<string, TemplateInstructionInfo>>(
      (acc, instruction) => {
        acc[instruction.instructionField] = instruction
        return acc
      },
      {}
    )
  }, [template])

  const [templateInstructions, setTemplateInstructions] =
    useState<Record<string, TemplateInstructionInfo>>(initialInstructionsMap)

  const submitOptions =
    mode === 'edit'
      ? ({ mode: 'edit', templateRepository, templateId: template!.id } as const)
      : ({ mode: 'create', templateRepository, collectionId } as const)
  const { submissionStatus, submitError, submitTemplate } = useSubmitTemplate(submitOptions)

  const { fetchDatasetTemplates } = useGetTemplatesByCollectionId({
    templateRepository,
    collectionIdOrAlias: collectionId
  })

  const form = useForm({ mode: 'onChange', defaultValues: formDefaultValues })

  useEffect(() => {
    form.reset(formDefaultValues)
  }, [form, formDefaultValues])

  const handleTemplateInstructionChange = (instruction: TemplateInstructionInfo) => {
    setTemplateInstructions((current) => {
      const next = { ...current }
      const { instructionField, instructionText } = instruction
      if (!instructionText) {
        delete next[instructionField]
        return next
      }
      next[instructionField] = instruction
      return next
    })
  }

  const handleSubmit = () => {
    if (!templateName.trim()) {
      setValidationError(t('createTemplate.errors.nameRequired'))
      return
    }

    setValidationError(null)

    void form.handleSubmit(async (formValues) => {
      const formValuesBackToDots = MetadataFieldsHelper.replaceSlashKeysWithDot(formValues)
      const datasetDto = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
        formValuesBackToDots,
        mode === 'edit' ? 'edit' : 'create'
      )
      const templateFields = datasetDto.metadataBlocks.flatMap((metadataBlock) =>
        MetadataFieldsHelper.buildTemplateFieldsFromMetadataValues(
          metadataBlock.fields,
          metadataFieldsForMapping[metadataBlock.name]
        )
      )

      const instructions = Object.values(templateInstructions)

      if (mode === 'edit') {
        const updatePayload: UpdateTemplateMetadataInfo = {
          name: templateName.trim(),
          fields: templateFields,
          instructions
        }
        const didSubmit = await submitTemplate(updatePayload)
        if (!didSubmit) return

        navigate(RouteWithParams.COLLECTION_TEMPLATES(collectionId), {
          state: { fromEditTemplate: true }
        })
        return
      }

      const templatePayload: TemplateInfo = {
        name: templateName.trim(),
        fields: templateFields,
        ...(instructions.length > 0 ? { instructions } : {})
      }

      const didSubmit = await submitTemplate(templatePayload)
      if (!didSubmit) return

      const updatedTemplates = await fetchDatasetTemplates()
      const normalizedName = templateName.trim().toLowerCase()
      const createdTemplate = updatedTemplates.find(
        (currentTemplate) => currentTemplate.name.trim().toLowerCase() === normalizedName
      )

      if (!createdTemplate) return

      navigate(
        RouteWithParams.TEMPLATES_EDIT(collectionId, createdTemplate.id, TemplateEditMode.LICENSE),
        {
          state: { fromCreateTemplate: true }
        }
      )
    })()
  }

  const submitButtonLabel =
    mode === 'edit' ? tShared('saveChanges') : t('createTemplate.saveAddTerms')

  return (
    <FormProvider {...form}>
      <form noValidate={true}>
        {submissionStatus === SubmissionStatus.SubmitComplete && mode === 'create' && (
          <Alert variant="success" dismissible={false}>
            {t('createTemplate.alerts.success')}
          </Alert>
        )}
        {(validationError ?? submitError) && (
          <Alert variant="danger" dismissible={false}>
            {validationError ?? submitError}
          </Alert>
        )}
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
        <RequiredFieldText i18nKey="asterisksRequiredDatasetFields" />
        <RequiredFieldText />
        <Accordion defaultActiveKey="0" className={styles.accordion}>
          {metadataBlocksInfo.map((metadataBlock, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              id={`metadata-block-item-${metadataBlock.name}`}
              key={metadataBlock.id}>
              <Accordion.Header>{metadataBlock.displayName}</Accordion.Header>
              <Accordion.Body>
                <MetadataBlockFormFields
                  metadataBlock={metadataBlock}
                  templateInstructionValues={templateInstructions}
                  onTemplateInstructionChange={handleTemplateInstructionChange}
                  disableRequiredValidation={true}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <div className={styles['form-actions']}>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
            {submitButtonLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(RouteWithParams.COLLECTION_TEMPLATES(collectionId))}>
            {tShared('cancel')}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
