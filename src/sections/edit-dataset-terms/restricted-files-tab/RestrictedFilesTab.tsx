import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button, Alert } from '@iqss/dataverse-design-system'
import styles from '../dataset-terms-tab/DatasetTermsTab.module.scss'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useDataset } from '../../dataset/DatasetContext'
import { useUpdateTermsOfAccess } from './useUpdateTermsOfAccess'

interface RestrictedFilesTabProps {
  datasetRepository: DatasetRepository
  initialTermsOfAccess: TermsOfAccess
}

export function RestrictedFilesTab({
  datasetRepository: _datasetRepository,
  initialTermsOfAccess
}: RestrictedFilesTabProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { dataset, refreshDataset } = useDataset()

  const formContainerRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { handleUpdateTermsOfAccess } = useUpdateTermsOfAccess({
    datasetRepository: _datasetRepository,
    onSuccessfulUpdateTermsOfAccess: () => {
      toast.success(t('alerts.termsUpdated.alertText'))
      refreshDataset()
    }
  })

  const form = useForm<TermsOfAccess>({
    defaultValues: (dataset?.termsOfUse.termsOfAccess as TermsOfAccess) ?? initialTermsOfAccess,
    mode: 'onChange'
  })

  const { control, handleSubmit, reset, watch } = form

  useEffect(() => {
    const original = (dataset?.termsOfUse.termsOfAccess as TermsOfAccess) ?? null
    if (original) {
      reset(original)
    }
  }, [dataset, reset])

  const onSubmit = async (data: TermsOfAccess) => {
    if (!dataset) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await handleUpdateTermsOfAccess(dataset.id, data)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('editTerms.defaultUpdateError'))
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
    // When pressing Enter, only submit the form if the user is focused on the submit button itself
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false

    if (!isButton && !isButtonTypeSubmit) e.preventDefault()
  }

  // Generate terms of access fields dynamically from the actual termsOfAccess (excluding fileAccessRequest)
  const termsOfAccessFields = useMemo(() => {
    const termsOfAccess =
      (dataset?.termsOfUse.termsOfAccess as TermsOfAccess) ?? initialTermsOfAccess
    return Object.keys(termsOfAccess)
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
  }, [dataset?.termsOfUse.termsOfAccess, initialTermsOfAccess])

  return (
    <div ref={formContainerRef}>
      {
        <Alert variant="info" dismissible={false}>
          {t('termsTab.termsOfAccessInfo')}
        </Alert>
      }

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={preventEnterSubmit} noValidate={true}>
          <Form.Group controlId="fileAccessRequest" as={Row}>
            <Col sm={4}>
              <Form.Group.Label message={t(`termsTab.requestAccessTip`)}>
                {t('termsTab.requestAccess')}
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
                      label={t('editTerms.restrictedFiles.enableAccessRequest')}
                    />
                  </Form.Group>
                )}
              />
            </Col>
          </Form.Group>

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
                name={field.name as keyof TermsOfAccess}
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

          {submitError && (
            <Alert variant="danger" dismissible={false}>
              {submitError}
            </Alert>
          )}

          <div className={styles['form-actions']}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? tShared('saving') : tShared('saveChanges')}
            </Button>
            <Button
              variant="secondary"
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                reset((dataset?.termsOfUse.termsOfAccess as TermsOfAccess) ?? initialTermsOfAccess)
              }>
              {tShared('cancel')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
