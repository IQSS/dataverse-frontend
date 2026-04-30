import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button, Alert } from '@iqss/dataverse-design-system'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/templates/domain/models/Template'
import { useUpdateTemplateTermsOfAccess } from './useUpdateTemplateTermsOfAccess'
import styles from '@/sections/edit-dataset-terms/edit-license-and-terms/EditLicenseAndTerms.module.scss'

interface EditTemplateTermsOfAccessProps {
  template: Template
  templateRepository: TemplateRepository
  onSuccess: () => void
  onCancel?: () => void
  onFormStateChange?: (isDirty: boolean) => void
}

export function EditTemplateTermsOfAccess({
  template,
  templateRepository,
  onSuccess,
  onCancel,
  onFormStateChange
}: EditTemplateTermsOfAccessProps) {
  const { t: tDataset } = useTranslation('dataset')
  const { t: tTemplates } = useTranslation('datasetTemplates')
  const { t: tShared } = useTranslation('shared')

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

  const initialTermsOfAccess: TermsOfAccess =
    template.termsOfUse.termsOfAccess ?? defaultTermsOfAccess
  const formContainerRef = useRef<HTMLDivElement>(null)

  const { handleUpdateTermsOfAccess, isLoading, error } = useUpdateTemplateTermsOfAccess({
    templateRepository,
    onSuccess: () => {
      toast.success(tTemplates('editTemplate.alerts.termsOfAccessUpdated'))
      onSuccess()
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
    if (template.termsOfUse.termsOfAccess) {
      reset(template.termsOfUse.termsOfAccess)
    }
  }, [template.termsOfUse.termsOfAccess, reset])

  const fileAccessRequestValue = useWatch({ control, name: 'fileAccessRequest' })
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
    return Object.keys(initialTermsOfAccess)
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
                tDataset('termsTab.termsOfAccessRequiredWhenRequestDisabled')
            }
          }
        }
        return field
      })
  }, [initialTermsOfAccess, isRequestAccessEnabled, tDataset])

  return (
    <div ref={formContainerRef}>
      <Alert variant="info" dismissible={false}>
        {tDataset('termsTab.termsOfAccessInfo')}
      </Alert>

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(async (data) => {
            await handleUpdateTermsOfAccess(template.id, data)
          })}
          noValidate={true}>
          <Form.Group controlId="fileAccessRequest" as={Row}>
            <Col sm={4}>
              <Form.Group.Label message={tDataset('termsTab.requestAccessTip')}>
                {tDataset('termsTab.requestAccess')}
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
                      label={tDataset('termsTab.enableAccessRequest')}
                    />
                  </Form.Group>
                )}
              />
            </Col>
          </Form.Group>

          {termsOfAccessFields.map((field) => (
            <Form.Group key={field.name} controlId={field.name} as={Row}>
              <Form.Group.Label
                message={tDataset(`termsTab.${field.translationKey}Tip`)}
                required={field.required}
                column
                sm={4}>
                {tDataset(`termsTab.${field.translationKey}`)}
              </Form.Group.Label>
              <Controller
                name={field.name as keyof TermsOfAccess}
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
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                {tShared('close')}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
