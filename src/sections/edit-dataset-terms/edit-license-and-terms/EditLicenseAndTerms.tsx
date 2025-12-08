import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button, Alert } from '@iqss/dataverse-design-system'
import { CustomTerms } from '../../../dataset/domain/models/Dataset'
import { LicenseRepository } from '../../../licenses/domain/repositories/LicenseRepository'
import { useGetLicenses } from './useGetLicenses'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useDataset } from '../../dataset/DatasetContext'
import { useUpdateDatasetLicense } from './useUpdateDatasetLicense'
import { Route, QueryParamKey } from '../../Route.enum'
import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../dataset/domain/models/Dataset'
import styles from './EditLicenseAndTerms.module.scss'

const CUSTOM_LICENSE_VALUE = 'CUSTOM' as const

interface EditLicenseAndTermsFormData {
  license: string
  customTerms?: CustomTerms
}

interface EditLicenseAndTermsProps {
  licenseRepository: LicenseRepository
  datasetRepository: DatasetRepository
}

export function EditLicenseAndTerms({
  licenseRepository,
  datasetRepository
}: EditLicenseAndTermsProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { dataset, refreshDataset } = useDataset()
  const navigate = useNavigate()

  const formContainerRef = useRef<HTMLDivElement>(null)

  const { licenses, isLoadingLicenses, errorLicenses } = useGetLicenses({
    licenseRepository,
    autoFetch: true
  })

  const navigateToDatasetView = useCallback(() => {
    if (!dataset) return

    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

    if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    } else {
      searchParams.set(QueryParamKey.VERSION, dataset.version.number.toString())
    }

    navigate(`${Route.DATASETS}?${searchParams.toString()}`)
  }, [dataset, navigate])

  const { handleUpdateLicense, isLoading, error } = useUpdateDatasetLicense({
    datasetRepository,
    onSuccessfulUpdateLicense: () => {
      toast.success(t('alerts.licenseUpdated.alertText'))
      refreshDataset()
      navigateToDatasetView()
    }
  })

  const initialCustomTerms = useMemo((): CustomTerms => {
    if (dataset?.termsOfUse.customTerms) {
      return dataset.termsOfUse.customTerms
    }
    return {
      termsOfUse: '',
      confidentialityDeclaration: '',
      specialPermissions: '',
      restrictions: '',
      citationRequirements: '',
      depositorRequirements: '',
      conditions: '',
      disclaimer: ''
    }
  }, [dataset?.termsOfUse.customTerms])

  const licenseOptions = useMemo(() => {
    const dynamicOptions = licenses
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((license) => ({
        value: license.id.toString(),
        label: license.name,
        uri: license.uri,
        iconUri: license.iconUri || '',
        isDefault: license.isDefault
      }))

    dynamicOptions.push({
      value: CUSTOM_LICENSE_VALUE,
      label: t('editTerms.datasetTerms.customTermsLabel'),
      uri: '',
      iconUri: '',
      isDefault: dataset?.termsOfUse.customTerms !== undefined
    })

    return dynamicOptions
  }, [licenses, t, dataset?.termsOfUse.customTerms])

  const defaultLicenseValue = useMemo(() => {
    if (dataset?.termsOfUse.customTerms !== undefined) {
      return CUSTOM_LICENSE_VALUE
    }

    const matchingLicense = licenseOptions.find((option) => option.label === dataset?.license?.name)
    return matchingLicense?.value
  }, [licenseOptions, dataset?.license?.name, dataset?.termsOfUse.customTerms])

  const form = useForm<EditLicenseAndTermsFormData>({
    defaultValues: {
      license: defaultLicenseValue,
      customTerms: initialCustomTerms
    },
    mode: 'onChange'
  })

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid }
  } = form

  useEffect(() => {
    if (!isLoadingLicenses && licenseOptions.length > 0) {
      reset({
        license: defaultLicenseValue,
        customTerms: initialCustomTerms
      })
    }
  }, [defaultLicenseValue, initialCustomTerms, isLoadingLicenses, licenseOptions.length, reset])

  const watchedLicense = watch('license')
  const currentLicenseOption = licenseOptions.find((option) => option.value === watchedLicense)
  const isCustomTerms = watchedLicense === CUSTOM_LICENSE_VALUE

  const customTermsFields = useMemo(() => {
    return Object.keys(initialCustomTerms).map((fieldName) => ({
      name: fieldName,
      translationKey: fieldName,
      required: fieldName === 'termsOfUse' && isCustomTerms,
      rows: 4,
      rules:
        fieldName === 'termsOfUse' && isCustomTerms
          ? { required: t('editTerms.datasetTerms.customTermsRequired') }
          : {}
    }))
  }, [initialCustomTerms, isCustomTerms, t])

  const onSubmit = (data: EditLicenseAndTermsFormData) => {
    if (!dataset) return

    if (data.license === CUSTOM_LICENSE_VALUE) {
      void handleUpdateLicense(dataset.id, {
        customTerms: data.customTerms
      })
    } else {
      const selectedLicense = licenseOptions.find((option) => option.value === data.license)
      if (selectedLicense) {
        void handleUpdateLicense(dataset.id, {
          name: selectedLicense.label
        })
      }
    }
  }

  const handleCancel = () => {
    navigateToDatasetView()
  }

  return (
    <div ref={formContainerRef} className={styles['edit-license-and-terms']}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <Row style={{ marginBottom: '1rem' }}>
            <Col sm={4}>
              <Form.Group.Label>{t('license.title')}</Form.Group.Label>
            </Col>
            <Col sm={8}>
              <Form.Group.Text>{t('editTerms.datasetTerms.licenseDescription')}</Form.Group.Text>

              <Controller
                name="license"
                control={control}
                rules={{ required: t('editTerms.datasetTerms.licenseRequired') }}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Row>
                    <Col>
                      <Form.Group.Select
                        value={value}
                        onChange={onChange}
                        isInvalid={invalid}
                        disabled={isLoadingLicenses}>
                        {licenseOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Group.Select>
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    </Col>
                  </Row>
                )}
              />

              {errorLicenses && <Alert variant="danger">{errorLicenses}</Alert>}

              {currentLicenseOption && !isCustomTerms && (
                <div className={styles['license-icon']}>
                  {currentLicenseOption.iconUri && (
                    <img
                      src={currentLicenseOption.iconUri}
                      alt={`${t('license.altTextPrefix')}${currentLicenseOption.label}`}
                      title={currentLicenseOption.label}
                    />
                  )}
                  {currentLicenseOption.uri && (
                    <a href={currentLicenseOption.uri} target="_blank" rel="noreferrer">
                      {currentLicenseOption.label}
                    </a>
                  )}
                </div>
              )}
            </Col>
          </Row>

          {isCustomTerms && (
            <>
              {customTermsFields.map((field) => (
                <Form.Group key={field.name} controlId={`customTerms.${field.name}`}>
                  <Form.Group.Label
                    message={t(`termsTab.${field.translationKey}Tip`)}
                    required={field.required}
                    column
                    sm={4}>
                    {t(`termsTab.${field.translationKey}`)}
                  </Form.Group.Label>
                  <Controller
                    name={`customTerms.${field.name}` as keyof EditLicenseAndTermsFormData}
                    control={control}
                    rules={field.rules}
                    render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                      <Col sm={8}>
                        <Row>
                          <Col>
                            <Form.Group.TextArea
                              data-testid={`customTerms.${field.name}`}
                              value={value as string}
                              onChange={onChange}
                              isInvalid={invalid}
                              rows={field.rows}
                              aria-required={field.required}
                            />
                            {field.required && (
                              <Form.Group.Feedback type="invalid">
                                {error?.message}
                              </Form.Group.Feedback>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    )}
                  />
                </Form.Group>
              ))}
            </>
          )}

          {error && (
            <Alert variant="danger" dismissible={false}>
              {error}
            </Alert>
          )}

          <div className={styles['form-actions']}>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? tShared('saving') : tShared('saveChanges')}
            </Button>
            <Button variant="secondary" type="button" disabled={isLoading} onClick={handleCancel}>
              {tShared('cancel')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
