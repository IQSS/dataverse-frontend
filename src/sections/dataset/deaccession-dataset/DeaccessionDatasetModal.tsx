import { Trans, useTranslation } from 'react-i18next'
import { Alert, Button, Col, Form, Modal, Stack } from '@iqss/dataverse-design-system'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { isValidURL } from '@/metadata-block-info/domain/models/fieldValidations'
import { DeaccessionFormData } from './DeaccessionFormData'
import { Controller, Control, FieldErrors } from 'react-hook-form'

interface DeaccessionDatasetModalProps {
  show: boolean
  publishedVersions: DatasetVersionSummaryInfo[]
  handleClose: () => void
  handleSubmitForm: () => void
  control: Control<DeaccessionFormData>
  errors: FieldErrors<DeaccessionFormData>
}

export function DeaccessionDatasetModal({
  show,
  publishedVersions,
  handleClose,
  handleSubmitForm,
  control,
  errors
}: DeaccessionDatasetModalProps) {
  const { t } = useTranslation(['dataset', 'shared'])

  function isValidNonEmptyURL(value: string): boolean {
    if (value.trim() === '') {
      return true // Consider empty strings as valid
    }
    return isValidURL(value)
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>Deaccession Dataset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical">
          <Alert
            variant={'warning'}
            customHeading={'Deaccession is permanent.'}
            dismissible={false}>
            <Trans
              t={t}
              i18nKey="deaccession.warning"
              components={{
                anchor: (
                  <a
                    href="https://guides.dataverse.org/en/latest/user/dataset-management.html#dataset-deaccession"
                    target="_blank"
                    rel="noreferrer"
                  />
                )
              }}
            />
          </Alert>
          <form noValidate={true} onSubmit={handleSubmitForm}>
            {publishedVersions.length > 1 && (
              <Form.Group as={Col}>
                <Form.Group.Label>{t('deaccession.version.label')}</Form.Group.Label>
                <div>
                  <Controller
                    name="versions"
                    control={control}
                    rules={{
                      validate: (value) =>
                        value.length > 0 ? true : t('deaccession.version.validation')
                    }}
                    render={({ field }) => (
                      <>
                        {publishedVersions.map(
                          (version) =>
                            version.publishedOn && (
                              <Form.Group.Checkbox
                                key={version.versionNumber}
                                id={version.versionNumber}
                                label={`${version.versionNumber} - ${version.publishedOn ?? ''}`}
                                value={version.versionNumber}
                                checked={field.value.includes(version.versionNumber)}
                                isInvalid={!!errors.versions}
                                invalidFeedback={errors.versions?.message}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, e.target.value]
                                    : field.value.filter((val) => val !== e.target.value)
                                  field.onChange(newValue)
                                }}
                              />
                            )
                        )}
                      </>
                    )}
                  />
                </div>
              </Form.Group>
            )}
            <Form.Group as={Col} controlId={'deccessionReason'}>
              <Form.Group.Label required>{t('deaccession.reason.label')}</Form.Group.Label>
              <Controller
                name="deaccessionReason"
                control={control}
                rules={{ required: t('deaccession.reason.validation') }}
                render={({ field: { onChange, ref, value }, fieldState }) => (
                  <>
                    <Form.Group.Select
                      value={value}
                      onChange={onChange}
                      isInvalid={fieldState.invalid}
                      ref={ref}>
                      <option>Select...</option>
                      <option value={t('deaccession.reason.options.identifiable')}>
                        {t('deaccession.reason.options.identifiable')}
                      </option>
                      <option value={t('deaccession.reason.options.retracted')}>
                        {t('deaccession.reason.options.retracted')}
                      </option>
                      <option value={t('deaccession.reason.options.transferred')}>
                        {t('deaccession.reason.options.transferred')}
                      </option>
                      <option value={t('deaccession.reason.options.irb')}>
                        {t('deaccession.reason.options.irb')}
                      </option>
                      <option value={t('deaccession.reason.options.legalIssue')}>
                        {t('deaccession.reason.options.legalIssue')}
                      </option>
                      <option value={t('deaccession.reason.options.invalid')}>
                        {t('deaccession.reason.options.invalid')}
                      </option>
                    </Form.Group.Select>
                    <Form.Group.Feedback type="invalid">
                      {fieldState.error?.message}
                    </Form.Group.Feedback>
                  </>
                )}></Controller>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Group.Label>{t('deaccession.reasonOther.label')}</Form.Group.Label>
              <Controller
                name="deaccessionReasonOther"
                control={control}
                render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                  <>
                    <Form.Group.TextArea
                      value={value}
                      onChange={onChange}
                      isInvalid={invalid}
                      ref={ref}
                    />
                    {invalid && (
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    )}
                  </>
                )}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Group.Label>{t('deaccession.forwardUrl.label')}</Form.Group.Label>
              <Controller
                name="deaccessionForwardUrl"
                control={control}
                rules={{
                  validate: (value) =>
                    isValidNonEmptyURL(value) || t('deaccession.forwardUrl.validation')
                }}
                render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                  <>
                    <Form.Group.Input
                      type="text"
                      placeholder="https://"
                      data-testid="deaccession-forward-url"
                      value={value}
                      onChange={onChange}
                      isInvalid={invalid}
                      ref={ref}
                    />
                    {invalid && (
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    )}
                  </>
                )}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {t('continue', { ns: 'shared' })}
            </Button>
            <Button withSpacing variant="secondary" type="button" onClick={handleClose}>
              {t('cancel', { ns: 'shared' })}
            </Button>
          </form>
        </Stack>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}
