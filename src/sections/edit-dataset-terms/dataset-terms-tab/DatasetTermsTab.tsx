import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { Form, Row, Col, Button, Alert, Spinner } from '@iqss/dataverse-design-system'
import { DatasetLicense, CustomTerms } from '../../../dataset/domain/models/Dataset'
import { LicenseRepository } from '../../../licenses/domain/repositories/LicenseRepository'
import { useGetLicenses } from './useGetLicenses'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useUpdateDatasetLicense } from './useUpdateDatasetLicense'
import { useDataset } from '../../dataset/DatasetContext'
import styles from './DatasetTermsTab.module.scss'

// TODO: Remove this interface and use from model
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

// Default custom terms values
const DEFAULT_CUSTOM_TERMS: CustomTerms = {
  termsOfUse: '',
  confidentialityDeclaration: '',
  specialPermissions: '',
  restrictions: '',
  citationRequirements: '',
  depositorRequirements: '',
  conditions: '',
  disclaimer: ''
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
  const { handleUpdateLicense, isLoading, error } = useUpdateDatasetLicense({
    datasetRepository,
    onSuccessfulUpdateLicense: () => refreshDataset()
  })

  const { licenses, isLoadingLicenses, errorLicenses } = useGetLicenses({
    licenseRepository,
    autoFetch: true
  })

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

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid }
  } = useForm<DatasetTermsFormData>({
    defaultValues: {
      license: defaultLicenseValue,
      customTerms: isInitialCustomTerms ? (initialLicense as CustomTerms) : DEFAULT_CUSTOM_TERMS
    },
    mode: 'onChange'
  })

  // Reset form when licenses load and default license value changes
  useEffect(() => {
    if (!isLoadingLicenses && licenseOptions.length > 0) {
      reset({
        license: defaultLicenseValue,
        customTerms: isInitialCustomTerms ? (initialLicense as CustomTerms) : DEFAULT_CUSTOM_TERMS
      })
    }
  }, [
    defaultLicenseValue,
    initialLicense,
    isInitialCustomTerms,
    isLoadingLicenses,
    licenseOptions.length,
    reset
  ])

  const watchedLicense = watch('license')
  const currentLicenseOption = licenseOptions.find((option) => option.value === watchedLicense)
  const isCustomTerms = watchedLicense === 'CUSTOM'

  const customTermsFields = useMemo(() => {
    return Object.keys(DEFAULT_CUSTOM_TERMS).map((fieldName) => ({
      name: fieldName,
      translationKey: fieldName,
      required: fieldName === 'termsOfUse' && isCustomTerms,
      rows: 4,
      rules:
        fieldName === 'termsOfUse' && isCustomTerms
          ? { required: t('editTerms.datasetTerms.customTermsRequired') }
          : {}
    }))
  }, [isCustomTerms, t])

  const onSubmit = async (data: DatasetTermsFormData) => {
    if (!dataset) return

    if (data.license === 'CUSTOM') {
      // Update with custom terms
      await handleUpdateLicense(dataset.id, {
        customTerms: data.customTerms
      })
    } else {
      // Find the selected license by ID
      const selectedLicense = licenseOptions.find((option) => option.value === data.license)
      if (selectedLicense) {
        await handleUpdateLicense(dataset.id, {
          name: selectedLicense.label
        })
      }
    }
  }

  return (
    <div className={styles['dataset-terms-tab']}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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

            {/* TODO: Error handling for license loading */}
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
                  render={({ field: { onChange, value, ref }, fieldState: { invalid, error } }) => (
                    <Col sm={8}>
                      <Row>
                        <Col>
                          <Form.Group.TextArea
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

        {/* Error Messages */}
        {error && (
          <Alert variant="danger" dismissible>
            {error}
          </Alert>
        )}

        {/* Form Actions */}
        <div className={styles['form-actions']}>
          <Button type="submit" disabled={!isValid || isLoading}>
            {isLoading ? tShared('saving') : tShared('saveChanges')}
          </Button>
          <Button
            variant="secondary"
            type="button"
            disabled={isLoading}
            onClick={() =>
              reset({
                license: defaultLicenseValue,
                customTerms: isInitialCustomTerms
                  ? (initialLicense as CustomTerms)
                  : DEFAULT_CUSTOM_TERMS
              })
            }>
            {tShared('cancel')}
          </Button>
        </div>
      </Form>
    </div>
  )
}
