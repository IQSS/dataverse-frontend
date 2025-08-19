import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { Form, Row, Col, Button } from '@iqss/dataverse-design-system'
import { DatasetLicense } from '../../../dataset/domain/models/Dataset'
import styles from './DatasetTermsTab.module.scss'

interface DatasetTermsFormData {
  license: string
  customTerms?: string
}

interface DatasetTermsTabProps {
  initialLicense?: DatasetLicense
  onSave?: (data: DatasetTermsFormData) => void
}

// Available license options
const LICENSE_OPTIONS = [
  {
    value: 'CC0_1.0',
    label: 'CC0 1.0',
    uri: 'https://creativecommons.org/publicdomain/zero/1.0',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  },
  {
    value: 'CC_BY_4.0',
    label: 'CC BY 4.0',
    uri: 'https://creativecommons.org/licenses/by/4.0/',
    iconUri: 'https://licensebuttons.net/l/by/4.0/88x31.png'
  },
  {
    value: 'CC_BY_SA_4.0',
    label: 'CC BY-SA 4.0',
    uri: 'https://creativecommons.org/licenses/by-sa/4.0/',
    iconUri: 'https://licensebuttons.net/l/by-sa/4.0/88x31.png'
  },
  {
    value: 'CC_BY_NC_4.0',
    label: 'CC BY-NC 4.0',
    uri: 'https://creativecommons.org/licenses/by-nc/4.0/',
    iconUri: 'https://licensebuttons.net/l/by-nc/4.0/88x31.png'
  },
  {
    value: 'CUSTOM',
    label: 'Custom Dataset Terms',
    uri: '',
    iconUri: ''
  }
]

export function DatasetTermsTab({ initialLicense, onSave }: DatasetTermsTabProps) {
  const { t } = useTranslation('dataset')
  const [selectedLicense, setSelectedLicense] = useState<string>(
    initialLicense?.name === 'CC0 1.0' ? 'CC0_1.0' : 'CC0_1.0'
  )

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid }
  } = useForm<DatasetTermsFormData>({
    defaultValues: {
      license: selectedLicense,
      customTerms: ''
    },
    mode: 'onChange'
  })

  const watchedLicense = watch('license')
  const currentLicenseOption = LICENSE_OPTIONS.find((option) => option.value === watchedLicense)
  const isCustomTerms = watchedLicense === 'CUSTOM'

  const onSubmit = (data: DatasetTermsFormData) => {
    onSave?.(data)
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
                This dataset will be published under the terms specified below. Our Community Norms
                as well as good scientific practices expect that proper credit is given via
                citation.
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
                        onChange={(e) => {
                          onChange(e)
                          setSelectedLicense(e.target.value)
                        }}
                        isInvalid={invalid}
                        aria-label={t('license.title')}>
                        {LICENSE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Group.Select>
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    </Form.Group>
                  )}
                />
              </div>

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
        </div>{' '}
      </Form>{' '}
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
