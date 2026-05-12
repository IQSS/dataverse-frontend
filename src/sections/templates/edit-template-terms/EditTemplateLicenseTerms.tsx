import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button, Alert } from '@iqss/dataverse-design-system'
import { CustomTerms } from '@/dataset/domain/models/Dataset'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/templates/domain/models/Template'
import { useGetLicenses } from '@/sections/edit-dataset-terms/edit-license-and-terms/useGetLicenses'
import { useUpdateTemplateLicenseTerms } from './useUpdateTemplateLicenseTerms'
import styles from '@/sections/edit-dataset-terms/edit-license-and-terms/EditLicenseAndTerms.module.scss'

const CUSTOM_LICENSE_VALUE = 'CUSTOM' as const

interface FormData {
  license: string
  customTerms?: CustomTerms
}

interface EditTemplateLicenseTermsProps {
  template: Template
  templateRepository: TemplateRepository
  licenseRepository: LicenseRepository
  onSuccess: () => void
  onCancel?: () => void
  onFormStateChange?: (isDirty: boolean) => void
}

export function EditTemplateLicenseTerms({
  template,
  templateRepository,
  licenseRepository,
  onSuccess,
  onCancel,
  onFormStateChange
}: EditTemplateLicenseTermsProps) {
  const { t: tDataset } = useTranslation('dataset')
  const { t: tTemplates } = useTranslation('datasetTemplates')
  const { t: tShared } = useTranslation('shared')

  const formContainerRef = useRef<HTMLDivElement>(null)

  const { licenses, isLoadingLicenses, errorLicenses } = useGetLicenses({
    licenseRepository,
    autoFetch: true
  })

  const { handleUpdateLicenseTerms, isLoading, error } = useUpdateTemplateLicenseTerms({
    templateRepository,
    onSuccess: () => {
      toast.success(tTemplates('editTemplate.alerts.licenseUpdated'))
      onSuccess()
    }
  })

  const initialCustomTerms = useMemo<CustomTerms>(() => {
    if (template.termsOfUse.customTerms) {
      return template.termsOfUse.customTerms
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
  }, [template.termsOfUse.customTerms])

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
      label: tDataset('editTerms.datasetTerms.customTermsLabel'),
      uri: '',
      iconUri: '',
      isDefault: template.termsOfUse.customTerms !== undefined
    })

    return dynamicOptions
  }, [licenses, tDataset, template.termsOfUse.customTerms])

  const defaultLicenseValue = useMemo(() => {
    if (template.termsOfUse.customTerms !== undefined) {
      return CUSTOM_LICENSE_VALUE
    }
    const matchingLicense = licenseOptions.find((option) => option.label === template.license?.name)
    return matchingLicense?.value
  }, [licenseOptions, template.license?.name, template.termsOfUse.customTerms])

  const form = useForm<FormData>({
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
    formState: { isValid, isDirty }
  } = form

  useEffect(() => {
    onFormStateChange?.(isDirty)
  }, [isDirty, onFormStateChange])

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
          ? { required: tDataset('editTerms.datasetTerms.customTermsRequired') }
          : {}
    }))
  }, [initialCustomTerms, isCustomTerms, tDataset])

  const onSubmit = async (data: FormData) => {
    if (data.license === CUSTOM_LICENSE_VALUE) {
      await handleUpdateLicenseTerms(template.id, {
        customTerms: data.customTerms
      })
    } else {
      const selectedLicense = licenseOptions.find((option) => option.value === data.license)
      if (selectedLicense) {
        await handleUpdateLicenseTerms(template.id, { name: selectedLicense.label })
      }
    }
  }

  return (
    <div ref={formContainerRef} className={styles['edit-license-and-terms']}>
      <FormProvider {...form}>
        <form
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
          noValidate={true}>
          <Row style={{ marginBottom: '1rem' }}>
            <Col sm={4}>
              <Form.Group.Label>{tDataset('license.title')}</Form.Group.Label>
            </Col>
            <Col sm={8}>
              <Form.Group.Text>
                {tDataset('editTerms.datasetTerms.licenseDescription')}
              </Form.Group.Text>
              <Controller
                name="license"
                control={control}
                rules={{ required: tDataset('editTerms.datasetTerms.licenseRequired') }}
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
                      alt={`${tDataset('license.altTextPrefix')}${currentLicenseOption.label}`}
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
                    message={tDataset(`termsTab.${field.translationKey}Tip`)}
                    required={field.required}
                    column
                    sm={4}>
                    {tDataset(`termsTab.${field.translationKey}`)}
                  </Form.Group.Label>
                  <Controller
                    name={`customTerms.${field.name}` as keyof FormData}
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
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isLoading}
                data-testid="cancel-edit-template-license-terms-button">
                {tShared('close')}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
