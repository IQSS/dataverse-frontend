import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { Form, Row, Col, Button } from '@iqss/dataverse-design-system'
import styles from './RestrictedFilesTab.module.scss'

interface RestrictedFilesFormData {
  enableAccessRequest: boolean
  termsOfAccessForRestrictedFiles: string
  dataAccessPlace: string
  originalArchive: string
  availabilityStatus: string
  contactForAccess: string
  sizeOfCollection: string
  studyCompletion: string
}

interface RestrictedFilesTabProps {
  onSave?: (data: RestrictedFilesFormData) => void
}

export function RestrictedFilesTab({ onSave }: RestrictedFilesTabProps) {
  const { t } = useTranslation('dataset')

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<RestrictedFilesFormData>({
    defaultValues: {
      enableAccessRequest: false,
      termsOfAccessForRestrictedFiles: '',
      dataAccessPlace: '',
      originalArchive: '',
      availabilityStatus: '',
      contactForAccess: '',
      sizeOfCollection: '',
      studyCompletion: ''
    },
    mode: 'onChange'
  })

  const onSubmit = (data: RestrictedFilesFormData) => {
    onSave?.(data)
  }

  return (
    <div className={styles['restricted-files-tab']}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Request Access Section */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.requestAccess')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="enableAccessRequest"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Form.Group>
                    <Form.Group.Checkbox
                      id="enableAccessRequest"
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

        {/* Terms of Access for Restricted Files */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.termsOfAccess')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="termsOfAccessForRestrictedFiles"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Form.Group>
                    <Form.Group.TextArea value={value} onChange={onChange} isInvalid={invalid} />
                  </Form.Group>
                )}
              />
            </Col>
          </Row>
        </section>

        {/* Data Access Place */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.dataAccessPlace')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="dataAccessPlace"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Form.Group>
                    <Form.Group.TextArea value={value} onChange={onChange} isInvalid={invalid} />
                  </Form.Group>
                )}
              />
            </Col>
          </Row>
        </section>

        {/* Original Archive */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.originalArchive')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="originalArchive"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Form.Group>
                    <Form.Group.TextArea value={value} onChange={onChange} isInvalid={invalid} />
                  </Form.Group>
                )}
              />
            </Col>
          </Row>
        </section>

        {/* Availability Status */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.availabilityStatus')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="availabilityStatus"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Form.Group>
                    <Form.Group.TextArea value={value} onChange={onChange} isInvalid={invalid} />
                  </Form.Group>
                )}
              />
            </Col>
          </Row>
        </section>

        {/* Contact for Access */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.contactForAccess')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="contactForAccess"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Form.Group>
                    <Form.Group.TextArea value={value} onChange={onChange} isInvalid={invalid} />
                  </Form.Group>
                )}
              />
            </Col>
          </Row>
        </section>

        {/* Size of Collection */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.sizeOfCollection')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="sizeOfCollection"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Form.Group>
                    <Form.Group.TextArea value={value} onChange={onChange} isInvalid={invalid} />
                  </Form.Group>
                )}
              />
            </Col>
          </Row>
        </section>

        {/* Study Completion */}
        <section className={styles['form-section']}>
          <Row>
            <Col sm={3}>
              <h4 className={styles['section-title']}>
                {t('editTerms.restrictedFiles.studyCompletion')}
              </h4>
            </Col>
            <Col sm={9}>
              <Controller
                name="studyCompletion"
                control={control}
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <Form.Group>
                    <Form.Group.TextArea value={value} onChange={onChange} isInvalid={invalid} />
                  </Form.Group>
                )}
              />
            </Col>
          </Row>
        </section>

        {/* Form Actions */}
        <div className={styles['form-actions']}>
          <Button type="submit" disabled={!isValid}>
            {t('editTerms.saveButton')}
          </Button>
          <Button variant="secondary" type="button">
            {t('editTerms.cancelButton')}
          </Button>
        </div>
      </Form>
    </div>
  )
}
