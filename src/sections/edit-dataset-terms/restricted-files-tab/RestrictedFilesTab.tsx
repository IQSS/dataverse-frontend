import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { Form, Row, Col, Button } from '@iqss/dataverse-design-system'
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
  fileAccessRequest: false,
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

  // Get initial form values from initialTermsOfAccess or defaults
  const initialFormValues = useMemo(() => {
    return {
      fileAccessRequest:
        initialTermsOfAccess?.fileAccessRequest ?? DEFAULT_TERMS_OF_ACCESS.fileAccessRequest,
      termsOfAccessForRestrictedFiles:
        initialTermsOfAccess?.termsOfAccessForRestrictedFiles ??
        DEFAULT_TERMS_OF_ACCESS.termsOfAccessForRestrictedFiles,
      dataAccessPlace:
        initialTermsOfAccess?.dataAccessPlace ?? DEFAULT_TERMS_OF_ACCESS.dataAccessPlace,
      originalArchive:
        initialTermsOfAccess?.originalArchive ?? DEFAULT_TERMS_OF_ACCESS.originalArchive,
      availabilityStatus:
        initialTermsOfAccess?.availabilityStatus ?? DEFAULT_TERMS_OF_ACCESS.availabilityStatus,
      contactForAccess:
        initialTermsOfAccess?.contactForAccess ?? DEFAULT_TERMS_OF_ACCESS.contactForAccess,
      sizeOfCollection:
        initialTermsOfAccess?.sizeOfCollection ?? DEFAULT_TERMS_OF_ACCESS.sizeOfCollection,
      studyCompletion:
        initialTermsOfAccess?.studyCompletion ?? DEFAULT_TERMS_OF_ACCESS.studyCompletion
    }
  }, [initialTermsOfAccess])

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm<RestrictedFilesFormData>({
    defaultValues: initialFormValues,
    mode: 'onChange'
  })

  // TODO: Implement actual save logic using datasetRepository
  const onSubmit = (data: RestrictedFilesFormData) => {
    console.log('TODO: Implement actual save logic using datasetRepository', data)
  }

  // Terms of access field configuration
  const termsOfAccessFields = useMemo(
    () => [
      {
        name: 'termsOfAccessForRestrictedFiles',
        type: 'textarea',
        rows: 4,
        translationKey: 'termsOfAccess',
        required: false
      },
      {
        name: 'dataAccessPlace',
        type: 'textarea',
        rows: 3,
        translationKey: 'dataAccessPlace',
        required: false
      },
      {
        name: 'originalArchive',
        type: 'textarea',
        rows: 3,
        translationKey: 'originalArchive',
        required: false
      },
      {
        name: 'availabilityStatus',
        type: 'textarea',
        rows: 3,
        translationKey: 'availabilityStatus',
        required: false
      },
      {
        name: 'contactForAccess',
        type: 'textarea',
        rows: 3,
        translationKey: 'contactForAccess',
        required: false
      },
      {
        name: 'sizeOfCollection',
        type: 'input',
        translationKey: 'sizeOfCollection',
        required: false
      },
      {
        name: 'studyCompletion',
        type: 'input',
        translationKey: 'studyCompletion',
        required: false
      }
    ],
    []
  )

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Request Access Section */}
        <section>
          <Row>
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
          </Row>
        </section>

        {/* Form Fields */}
        {termsOfAccessFields.map((field) => (
          <Form.Group key={field.name} controlId={field.name}>
            <Form.Group.Label message={t(`termsTab.${field.translationKey}Tip`)} column sm={4}>
              {t(`termsTab.${field.translationKey}`)}
            </Form.Group.Label>
            <Controller
              name={field.name as keyof RestrictedFilesFormData}
              control={control}
              render={({ field: { onChange, value, ref }, fieldState: { invalid, error } }) => (
                <Col sm={8}>
                  <Row>
                    <Col>
                      <Form.Group.TextArea
                        value={value as string}
                        onChange={onChange}
                        isInvalid={invalid}
                        rows={field.rows}
                        ref={ref}
                      />

                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    </Col>
                  </Row>
                </Col>
              )}
            />
          </Form.Group>
        ))}

        <div className={styles['form-actions']}>
          <Button type="submit" disabled={!isValid}>
            {t('editTerms.saveButton')}
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset(initialFormValues)}>
            {t('editTerms.cancelButton')}
          </Button>
        </div>
      </Form>
    </div>
  )
}
