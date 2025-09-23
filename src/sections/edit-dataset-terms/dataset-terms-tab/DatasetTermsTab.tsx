import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { Form, Row, Col, Button, Alert } from '@iqss/dataverse-design-system'
import { DatasetLicense } from '../../../dataset/domain/models/Dataset'
import { LicenseRepository } from '../../../licenses/domain/repositories/LicenseRepository'
import { useGetLicenses } from './useGetLicenses'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import styles from './DatasetTermsTab.module.scss'

interface DatasetTermsFormData {
  license: string
  customTerms?: string
}

interface DatasetTermsTabProps {
  initialLicense?: DatasetLicense
  licenseRepository: LicenseRepository
  datasetRepository: DatasetRepository
}

export function DatasetTermsTab({
  initialLicense,
  licenseRepository,
  datasetRepository: _datasetRepository
}: DatasetTermsTabProps) {
  const { t } = useTranslation('dataset')
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
      isDefault: false
    })

    return dynamicOptions
  }, [licenses, t])

  // Find default license or use first available license
  const defaultLicenseValue = useMemo(() => {
    if (licenseOptions.length === 0) {
      return 'CUSTOM'
    }

    if (initialLicense) {
      const matchingLicense = licenseOptions.find((option) => option.label === initialLicense.name)
      if (matchingLicense) return matchingLicense.value
    }

    const defaultLicense = licenseOptions.find((option) => option.isDefault)
    return defaultLicense?.value || licenseOptions[0]?.value || 'CUSTOM'
  }, [licenseOptions, initialLicense])

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid }
  } = useForm<DatasetTermsFormData>({
    defaultValues: {
      license: defaultLicenseValue,
      customTerms: ''
    },
    mode: 'onChange'
  })

  const watchedLicense = watch('license')
  const currentLicenseOption = licenseOptions.find((option) => option.value === watchedLicense)
  const isCustomTerms = watchedLicense === 'CUSTOM'

  const onSubmit = (data: DatasetTermsFormData) => {
    // TODO: Implement actual save logic using datasetRepository
    alert(
      t('editTerms.datasetTerms.saveSuccessMessage', {
        license: data.license,
        customTerms: data.customTerms || 'None'
      })
    )
  }

  return (
    <div className={styles['dataset-terms-tab']}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* License/Data Use Agreement Section */}
        <div className={styles['license-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>{t('license.title')}</h4>
            </Col>
            <Col sm={9}>
              <div className={styles['license-description']}>
                {t('editTerms.datasetTerms.licenseDescription')}
              </div>

              {/* License Selection Dropdown */}
              <div className={styles['license-selection']}>
                <Controller
                  name="license"
                  control={control}
                  rules={{ required: t('editTerms.datasetTerms.licenseRequired') }}
                  render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                    <Form.Group>
                      <Form.Group.Select
                        value={value}
                        onChange={onChange}
                        isInvalid={invalid}
                        aria-label={t('license.title')}
                        disabled={isLoadingLicenses}>
                        {isLoadingLicenses ? (
                          <option>{t('loading')}</option>
                        ) : errorLicenses ? (
                          <option value="">
                            {t('editTerms.datasetTerms.errorLoadingLicenses')}
                          </option>
                        ) : (
                          licenseOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))
                        )}
                      </Form.Group.Select>
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    </Form.Group>
                  )}
                />
              </div>

              {/* Error handling for license loading */}
              {errorLicenses && <Alert variant="warning">{errorLicenses}</Alert>}

              {/* License Display */}
              {currentLicenseOption && !isCustomTerms && (
                <>
                  {currentLicenseOption.iconUri && (
                    <img
                      src={currentLicenseOption.iconUri}
                      alt={`${t('license.altTextPrefix')}${currentLicenseOption.label}`}
                      title={currentLicenseOption.label}
                      className={styles['license-icon']}
                    />
                  )}
                  {currentLicenseOption.uri && (
                    <a
                      href={currentLicenseOption.uri}
                      target="_blank"
                      rel="noreferrer"
                      className={styles['license-link']}>
                      {currentLicenseOption.label}
                    </a>
                  )}
                </>
              )}

              {/* Custom Terms Section */}
              {isCustomTerms && (
                <div className={styles['custom-terms-section']}>
                  <Controller
                    name="customTerms"
                    control={control}
                    rules={{
                      required: isCustomTerms
                        ? t('editTerms.datasetTerms.customTermsRequired')
                        : false
                    }}
                    render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                      <Form.Group>
                        <Form.Group.Label required={isCustomTerms}>
                          {t('customTerms.title')}
                        </Form.Group.Label>
                        <Form.Group.TextArea
                          value={value}
                          onChange={onChange}
                          isInvalid={invalid}
                          rows={4}
                        />
                        <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                        <Form.Group.Text>{t('customTerms.description')}</Form.Group.Text>
                      </Form.Group>
                    )}
                  />
                </div>
              )}
            </Col>
          </Row>
          {/* Form Actions */}
        </div>
      </Form>
      <div className={styles['form-actions']}>
        <Button type="submit" disabled={!isValid}>
          {t('editTerms.saveButton')}
        </Button>
        <Button variant="secondary" type="button">
          {t('editTerms.cancelButton')}
        </Button>
      </div>
    </div>
  )
}
