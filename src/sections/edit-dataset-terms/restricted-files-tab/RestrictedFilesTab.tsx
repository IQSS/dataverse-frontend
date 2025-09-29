import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { Form, Row, Col, Button, Alert } from '@iqss/dataverse-design-system'
import styles from '../dataset-terms-tab/DatasetTermsTab.module.scss'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

// Use TermsOfAccess directly from model
type RestrictedFilesFormData = TermsOfAccess

interface RestrictedFilesTabProps {
  datasetRepository: DatasetRepository
  initialTermsOfAccess: TermsOfAccess
}

// Default terms of access values
const DEFAULT_TERMS_OF_ACCESS: TermsOfAccess = {
  fileAccessRequest: true, // Enable access request by default
  termsOfAccessForRestrictedFiles: '',
  dataAccessPlace: '',
  originalArchive: '',
  availabilityStatus: '',
  contactForAccess: '',
  sizeOfCollection: '',
  studyCompletion: ''
}

export function RestrictedFilesTab({
  datasetRepository: _datasetRepository,
  initialTermsOfAccess
}: RestrictedFilesTabProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = useForm<RestrictedFilesFormData>({
    defaultValues: initialTermsOfAccess,
    mode: 'onChange'
  })

  // Watch the fileAccessRequest field to show/hide info alert
  const watchedFileAccessRequest = watch('fileAccessRequest')

  // TODO: Implement actual save logic using datasetRepository
  const onSubmit = (data: RestrictedFilesFormData) => {
    console.log('TODO: Implement actual save logic using datasetRepository', data)
  }

  // Generate terms of access fields dynamically from DEFAULT_TERMS_OF_ACCESS (excluding fileAccessRequest)
  const termsOfAccessFields = useMemo(() => {
    return Object.keys(DEFAULT_TERMS_OF_ACCESS)
      .filter((fieldName) => fieldName !== 'fileAccessRequest') // Exclude checkbox field
      .map((fieldName) => ({
        name: fieldName,
        translationKey:
          fieldName === 'termsOfAccessForRestrictedFiles' ? 'termsOfAccess' : fieldName,
        required: false,
        rows: 4,
        type: 'textarea',
        rules: {}
      }))
  }, [])

  return (
    <div>
      {/* Show info alert when access request is enabled */}
      {watchedFileAccessRequest && (
        <Alert variant="info" dismissible={false}>
          {t('termsTab.termsOfAccessInfo')}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Request Access Section */}
        <Form.Group controlId="fileAccessRequest" as={Row}>
          <Col sm={4}>
            <Form.Group.Label>{t('termsTab.requestAccess')}</Form.Group.Label>
          </Col>
          <Col sm={8}>
            <Controller
              name="fileAccessRequest"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Form.Group>
                  <Form.Group.Checkbox
                    id="fileAccessRequest"
                    checked={value}
                    onChange={onChange}
                    label={t('editTerms.restrictedFiles.enableAccessRequest')}
                  />
                </Form.Group>
              )}
            />
          </Col>
        </Form.Group>

        {/* Terms of Access Fields */}
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
              name={field.name as keyof RestrictedFilesFormData}
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

        <div className={styles['form-actions']}>
          <Button type="submit" disabled={!isValid}>
            {tShared('saveChanges')}
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset(initialTermsOfAccess)}>
            {tShared('cancel')}
          </Button>
        </div>
      </Form>
    </div>
  )
}
