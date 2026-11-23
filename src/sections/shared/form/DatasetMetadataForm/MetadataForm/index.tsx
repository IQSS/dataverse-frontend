import { useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FieldErrors, FormProvider, useForm } from 'react-hook-form'
import { useSession } from '@/sections/session/SessionContext'
import { Alert, Button } from '@iqss/dataverse-design-system'
import { type MetadataBlockInfo } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { type DatasetMetadataFormValues } from '../MetadataFieldsHelper'
import { type DatasetMetadataFormMode } from '..'
import { SubmissionStatus, useSubmitDataset } from '../useSubmitDataset'
import { MetadataBlocksAccordion } from './MetadataBlocksAccordion'
import { RequiredFieldsFirstLayout } from './RequiredFieldsFirstLayout/RequiredFieldsFirstLayout'
import { RequiredFieldsCounter } from './RequiredFieldsFirstLayout/RequiredFieldsCounter'
import { RequiredFieldsHelper } from './RequiredFieldsFirstLayout/RequiredFieldsHelper'
import { RequiredFieldText } from '../../RequiredFieldText/RequiredFieldText'
import { QueryParamKey, Route, RouteWithParams } from '@/sections/Route.enum'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'
import { usePrefillFieldsWithUserData } from './usePrefillFieldsWithUserData'
import { applyPrefillValues, getUserDataPrefillValues } from './userDataPrefill'
import { revealFirstInvalidField, revealFormField } from './revealFormField'
import { DatasetTemplateInstruction } from '@/templates/domain/models/Template'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { DatasetType } from '@/dataset/domain/models/DatasetType'
import styles from './index.module.scss'

interface FormProps {
  mode: DatasetMetadataFormMode
  collectionId: string
  formDefaultValues: DatasetMetadataFormValues
  metadataBlocksInfo: MetadataBlockInfo[]
  datasetPersistentID?: string
  datasetLastUpdateTime?: string
  datasetTemplateInstructions?: DatasetTemplateInstruction[]
  datasetTypeName?: DatasetType['name']
}

export const MetadataForm = ({
  mode,
  collectionId,
  formDefaultValues,
  metadataBlocksInfo,
  datasetPersistentID,
  datasetLastUpdateTime,
  datasetTemplateInstructions,
  datasetTypeName
}: FormProps) => {
  const { datasetRepository } = useDatasetRepositories()
  const { user } = useSession()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation('shared')

  const formContainerRef = useRef<HTMLDivElement>(null)

  const onCreateMode = mode === 'create'
  const onEditMode = mode === 'edit'

  const form = useForm({ mode: 'onChange', defaultValues: formDefaultValues })
  const { setValue } = form

  const { submissionStatus, submitError, submitForm } = useSubmitDataset(
    mode,
    collectionId,
    datasetRepository,
    onSubmitDatasetError,
    datasetPersistentID,
    datasetLastUpdateTime,
    datasetTypeName
  )

  usePrefillFieldsWithUserData({ mode, user, formDefaultValues, setValue })

  // On create mode the fields are laid out by what is still required, so we need to know which
  // fields are required and which values the form starts with (defaults plus the account prefill)
  const requiredFields = useMemo(
    () => (onCreateMode ? RequiredFieldsHelper.collectRequiredFields(metadataBlocksInfo) : []),
    [onCreateMode, metadataBlocksInfo]
  )

  const accountPrefillValues = useMemo(
    () => (onCreateMode && user ? getUserDataPrefillValues(formDefaultValues, user) : []),
    [onCreateMode, user, formDefaultValues]
  )

  const initialValues = useMemo(
    () => applyPrefillValues(formDefaultValues, accountPrefillValues),
    [formDefaultValues, accountPrefillValues]
  )

  const handleCancel = () => {
    if (onEditMode && datasetPersistentID) {
      const returnParams = new URLSearchParams({
        [QueryParamKey.PERSISTENT_ID]: datasetPersistentID
      })
      const version = searchParams.get(QueryParamKey.VERSION)
      if (version) {
        returnParams.set(QueryParamKey.VERSION, version)
      }
      navigate(`${Route.DATASETS}?${returnParams.toString()}`)
      return
    }
    navigate(RouteWithParams.COLLECTIONS(collectionId))
  }

  const onInvalidSubmit = (errors: FieldErrors<DatasetMetadataFormValues>) => {
    if (!formContainerRef.current) return
    // Open any folded section hiding the first field with an error, then scroll to it and focus it
    revealFirstInvalidField(formContainerRef.current, errors)
  }

  const goToField = (controlName: string) => {
    if (!formContainerRef.current) return
    revealFormField(formContainerRef.current, controlName)
  }

  function onSubmitDatasetError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const disableSubmitButton = submissionStatus === SubmissionStatus.IsSubmitting

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement | HTMLButtonElement>) => {
    // When pressing Enter, only submit the form  if the user is focused on the submit button itself
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false

    if (!isButton && !isButtonTypeSubmit) e.preventDefault()
  }

  return (
    <section
      className={styles['form-container']}
      ref={formContainerRef}
      data-testid="metadata-form">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm, onInvalidSubmit)}
          onKeyDown={preventEnterSubmit}
          noValidate={true}>
          <div className={styles['top-buttons-container']}>
            <RequiredFieldText />
            {onEditMode && (
              <div>
                <Button type="submit" disabled={disableSubmitButton}>
                  {t('saveChanges')}
                </Button>
                <Button
                  withSpacing
                  variant="secondary"
                  type="button"
                  onClick={handleCancel}
                  disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
                  {t('cancel')}
                </Button>
              </div>
            )}
          </div>

          {submissionStatus === SubmissionStatus.Errored && (
            <Alert
              variant={'danger'}
              customHeading={t('datasetMetadataForm.validationAlert.title')}
              dismissible={false}>
              {submitError}
            </Alert>
          )}

          {submissionStatus === SubmissionStatus.SubmitComplete && (
            <Alert variant="success" dismissible={false}>
              {t('datasetMetadataForm.status.success')}
            </Alert>
          )}

          {metadataBlocksInfo.length > 0 &&
            (onCreateMode ? (
              <RequiredFieldsFirstLayout
                metadataBlocksInfo={metadataBlocksInfo}
                requiredFields={requiredFields}
                initialValues={initialValues}
                accountPrefillValues={accountPrefillValues}
                user={user}
                datasetTemplateInstructions={datasetTemplateInstructions}
              />
            ) : (
              <MetadataBlocksAccordion
                metadataBlocksInfo={metadataBlocksInfo}
                datasetTemplateInstructions={datasetTemplateInstructions}
              />
            ))}

          <SeparationLine />

          {onCreateMode && (
            <Alert
              variant={'info'}
              customHeading={t('datasetMetadataForm.metadataTip.title')}
              dismissible={false}>
              {t('datasetMetadataForm.metadataTip.content')}
            </Alert>
          )}
          <div className={styles['bottom-buttons-container']}>
            {onCreateMode && (
              <RequiredFieldsCounter requiredFields={requiredFields} onGoToField={goToField} />
            )}
            <div className={styles['bottom-buttons']}>
              <Button type="submit" disabled={disableSubmitButton}>
                {onCreateMode ? t('datasetMetadataForm.saveDataset') : t('saveChanges')}
              </Button>
              <Button
                withSpacing
                variant="secondary"
                type="button"
                onClick={handleCancel}
                disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  )
}
