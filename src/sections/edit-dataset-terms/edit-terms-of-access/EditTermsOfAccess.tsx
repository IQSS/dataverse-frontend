import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button, Alert } from '@iqss/dataverse-design-system'
import styles from '../edit-license-and-terms/EditLicenseAndTerms.module.scss'
import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus,
  TermsOfAccess
} from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useDataset } from '../../dataset/DatasetContext'
import { useUpdateTermsOfAccess } from './useUpdateTermsOfAccess'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { useNavigate } from 'react-router-dom'

interface EditTermsOfAccessProps {
  datasetRepository: DatasetRepository
  onFormStateChange?: (isDirty: boolean) => void
}

export function EditTermsOfAccess({
  datasetRepository,
  onFormStateChange
}: EditTermsOfAccessProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { dataset, refreshDataset } = useDataset()
  const navigate = useNavigate()

  const defaultTermsOfAccess: TermsOfAccess = {
    fileAccessRequest: false,
    termsOfAccessForRestrictedFiles: undefined,
    dataAccessPlace: undefined,
    originalArchive: undefined,
    availabilityStatus: undefined,
    contactForAccess: undefined,
    sizeOfCollection: undefined,
    studyCompletion: undefined
  }

  const initialTermsOfAccess =
    (dataset?.termsOfUse.termsOfAccess as TermsOfAccess) ?? defaultTermsOfAccess
  const formContainerRef = useRef<HTMLDivElement>(null)

  const { handleUpdateTermsOfAccess, isLoading, error } = useUpdateTermsOfAccess({
    datasetRepository,
    onSuccessfulUpdateTermsOfAccess: () => {
      toast.success(t('alerts.termsUpdated.alertText'))
      refreshDataset()
    }
  })

  const form = useForm<TermsOfAccess>({
    defaultValues: initialTermsOfAccess,
    mode: 'onChange'
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = form

  useEffect(() => {
    onFormStateChange?.(isDirty)
  }, [isDirty, onFormStateChange])

  useEffect(() => {
    if (dataset?.termsOfUse.termsOfAccess) {
      reset(dataset.termsOfUse.termsOfAccess)
    }
  }, [dataset?.termsOfUse.termsOfAccess, reset])

  const fileAccessRequestValue = useWatch({
    control,
    name: 'fileAccessRequest'
  })
  const termsOfAccessForRestrictedFilesValue = useWatch({
    control,
    name: 'termsOfAccessForRestrictedFiles'
  })
  const isRequestAccessEnabled =
    fileAccessRequestValue === undefined ? true : Boolean(fileAccessRequestValue)
  const isTermsOfAccessProvided =
    typeof termsOfAccessForRestrictedFilesValue === 'string' &&
    termsOfAccessForRestrictedFilesValue.trim().length > 0

  const termsOfAccessFields = useMemo(() => {
    const termsOfAccess = initialTermsOfAccess
    return Object.keys(termsOfAccess)
      .filter((fieldName) => fieldName !== 'fileAccessRequest')
      .map((fieldName) => ({
        name: fieldName,
        translationKey:
          fieldName === 'termsOfAccessForRestrictedFiles' ? 'termsOfAccess' : fieldName,
        required: false,
        rows: 4,
        type: 'textarea',
        rules: {}
      }))
      .map((field) => {
        if (field.name === 'termsOfAccessForRestrictedFiles') {
          const required = !isRequestAccessEnabled
          return {
            ...field,
            required,
            rules: {
              validate: (value: string | boolean | undefined) =>
                isRequestAccessEnabled ||
                (typeof value === 'string' && value.trim().length > 0) ||
                t('termsTab.termsOfAccessRequiredWhenRequestDisabled')
            }
          }
        }
        return field
      })
  }, [initialTermsOfAccess, isRequestAccessEnabled, t])

  const handleCancel = () => {
    if (!dataset) return

    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

    if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    } else {
      searchParams.set(QueryParamKey.VERSION, dataset.version.number.toString())
    }

    navigate(`${Route.DATASETS}?${searchParams.toString()}`)
  }

  return (
    <div ref={formContainerRef}>
      <Alert variant="info" dismissible={false}>
        {t('termsTab.termsOfAccessInfo')}
      </Alert>

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit((data) => {
            if (!dataset) return
            void handleUpdateTermsOfAccess(dataset.id, data)
          })}
          noValidate={true}>
          <Form.Group controlId="fileAccessRequest" as={Row}>
            <Col sm={4}>
              <Form.Group.Label message={t(`termsTab.requestAccessTip`)}>
                {t('termsTab.requestAccess')}
              </Form.Group.Label>
            </Col>
            <Col sm={8}>
              <Controller
                name="fileAccessRequest"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Form.Group style={{ margin: '5px' }}>
                    <Form.Group.Checkbox
                      id="fileAccessRequest"
                      checked={value}
                      onChange={onChange}
                      label={t('termsTab.enableAccessRequest')}
                    />
                  </Form.Group>
                )}
              />
            </Col>
          </Form.Group>

          {termsOfAccessFields.map((field) => (
            <Form.Group key={field.name} controlId={field.name} as={Row}>
              <Form.Group.Label
                message={t(`termsTab.${field.translationKey}Tip`)}
                required={field.required}
                column
                sm={4}>
                {t(`termsTab.${field.translationKey}`)}
              </Form.Group.Label>
              <Controller
                name={field.name as keyof TermsOfAccess}
                control={control}
                rules={field.rules}
                render={({ field: { onChange, value, ref }, fieldState: { invalid, error } }) => (
                  <Col sm={8}>
                    <Row>
                      <Col>
                        {field.type === 'input' ? (
                          <Form.Group.Input
                            type="text"
                            value={value as string}
                            onChange={onChange}
                            isInvalid={invalid}
                            aria-required={field.required}
                            ref={ref}
                          />
                        ) : (
                          <Form.Group.TextArea
                            value={value as string}
                            onChange={onChange}
                            isInvalid={invalid}
                            rows={field.rows}
                            aria-required={field.required}
                            ref={ref}
                          />
                        )}
                        {field.required && (
                          <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                        )}
                      </Col>
                    </Row>
                  </Col>
                )}
              />
            </Form.Group>
          ))}

          {error && (
            <Alert variant="danger" dismissible={false}>
              {error}
            </Alert>
          )}

          <div className={styles['form-actions']}>
            <Button
              type="submit"
              disabled={isLoading || (!isRequestAccessEnabled && !isTermsOfAccessProvided)}>
              {isLoading ? tShared('saving') : tShared('saveChanges')}
            </Button>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              {tShared('cancel')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
