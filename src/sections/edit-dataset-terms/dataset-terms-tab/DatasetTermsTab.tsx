import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button, Alert, Spinner } from '@iqss/dataverse-design-system'
import { DatasetLicense, CustomTerms } from '../../../dataset/domain/models/Dataset'
import { LicenseRepository } from '../../../licenses/domain/repositories/LicenseRepository'
import { useGetLicenses } from './useGetLicenses'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useDataset } from '../../dataset/DatasetContext'
import { updateDatasetLicense } from '@/dataset/domain/useCases/updateDatasetLicense'
import styles from './DatasetTermsTab.module.scss'

interface DatasetTermsFormData {
  license: string
  customTerms?: CustomTerms
}

interface DatasetTermsTabProps {
  initialLicense: DatasetLicense | CustomTerms
  licenseRepository: LicenseRepository
  datasetRepository: DatasetRepository
  isInitialCustomTerms: boolean
}

export function DatasetTermsTab({
  initialLicense,
  licenseRepository,
  datasetRepository,
  isInitialCustomTerms
}: DatasetTermsTabProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { dataset, refreshDataset } = useDataset()

  const formContainerRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { licenses, isLoadingLicenses, errorLicenses } = useGetLicenses({
    licenseRepository,
    autoFetch: true
  })

  const initialCustomTerms = useMemo((): CustomTerms => {
    if (isInitialCustomTerms) {
      return initialLicense as CustomTerms
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
  }, [initialLicense, isInitialCustomTerms])

  const licenseOptions = useMemo(() => {
    const dynamicOptions = licenses
      .filter((license) => license.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((license) => ({
        value: license.id.toString(),
        label: license.name,
        uri: license.uri,
        iconUri: license.iconUri || '',
        isDefault: license.isDefault
      }))

    dynamicOptions.push({
      value: 'CUSTOM',
      label: t('editTerms.datasetTerms.customTermsLabel'),
      uri: '',
      iconUri: '',
      isDefault: isInitialCustomTerms
    })

    return dynamicOptions
  }, [licenses, t, isInitialCustomTerms])

  // Determine the default license value based on initial state and available options
  const defaultLicenseValue = useMemo(() => {
    if (isInitialCustomTerms) {
      return 'CUSTOM'
    } else {
      const matchingLicense = licenseOptions.find(
        (option) => option.label === (initialLicense as DatasetLicense).name
      )
      return matchingLicense?.value
    }
  }, [licenseOptions, initialLicense, isInitialCustomTerms])

  const form = useForm<DatasetTermsFormData>({
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
  const isCustomTerms = watchedLicense === 'CUSTOM'

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

  const onSubmit = async (data: DatasetTermsFormData) => {
    if (!dataset) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (data.license === 'CUSTOM') {
        await updateDatasetLicense(datasetRepository, dataset.id, {
          customTerms: data.customTerms
        })
      } else {
        const selectedLicense = licenseOptions.find((option) => option.value === data.license)
        if (selectedLicense) {
          await updateDatasetLicense(datasetRepository, dataset.id, {
            name: selectedLicense.label
          })
        }
      }
      toast.success(t('alerts.licenseUpdated.alertText'))
      refreshDataset()
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message ? err.message : t('editTerms.defaultLicenseUpdateError')
      setSubmitError(errorMessage)
      onSubmitError()
    } finally {
      setIsSubmitting(false)
    }
  }

  function onSubmitError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement | HTMLButtonElement>) => {
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false

    if (!isButton && !isButtonTypeSubmit) e.preventDefault()
  }

  return (
    <div ref={formContainerRef} className={styles['dataset-terms-tab']}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={preventEnterSubmit} noValidate={true}>
          {/* License/Data Use Agreement Section */}
          <Row style={{ marginBottom: '1rem' }}>
            <Col sm={4}>
              <Form.Group.Label>{t('license.title')}</Form.Group.Label>
            </Col>
            <Col sm={8}>
              <Form.Group.Text>{t('editTerms.datasetTerms.licenseDescription')}</Form.Group.Text>

              {/* License Selection Dropdown */}
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
                        {isLoadingLicenses ? (
                          <Spinner variant="light" animation="border" size="sm" />
                        ) : errorLicenses ? (
                          <Alert variant="danger">
                            {t('editTerms.datasetTerms.errorLoadingLicenses')}
                          </Alert>
                        ) : (
                          licenseOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))
                        )}
                      </Form.Group.Select>
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    </Col>
                  </Row>
                )}
              />

              {errorLicenses && <Alert variant="danger">{errorLicenses}</Alert>}

              {currentLicenseOption && !isCustomTerms && (
                <>
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
                </>
              )}
            </Col>
          </Row>

          {/* Custom Terms Section */}
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
                    name={`customTerms.${field.name}` as keyof DatasetTermsFormData}
                    control={control}
                    rules={field.rules}
                    render={({
                      field: { onChange, value, ref },
                      fieldState: { invalid, error }
                    }) => (
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
                              ref={ref}
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

          {submitError && (
            <Alert variant="danger" dismissible={false}>
              {submitError}
            </Alert>
          )}

          <div className={styles['form-actions']}>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? tShared('saving') : tShared('saveChanges')}
            </Button>
            <Button
              variant="secondary"
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                reset({
                  license: defaultLicenseValue,
                  customTerms: initialCustomTerms
                })
              }>
              {tShared('cancel')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
