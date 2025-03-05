import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { Form } from '@iqss/dataverse-design-system'
import type { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'
import { QueryParamKey, Route } from '../../Route.enum'
import { useDeaccessionDataset } from '@/sections/dataset/deaccession-dataset/useDeaccessionDataset'
import { VersionSummary } from '@/dataset/domain/models/DatasetVersionDiff'
import { isValidURL } from '@/metadata-block-info/domain/models/fieldValidations'
import { DeaccessionFormData } from './DeaccessionFormData'
import { Controller, useForm } from 'react-hook-form'

interface PublishDatasetModalProps {
  show: boolean
  repository: DatasetRepository
  persistentId: string
  versionList: VersionSummary[]
  handleClose: () => void
}

export function DeaccessionDatasetModal({
  show,
  repository,
  persistentId,
  versionList,
  handleClose
}: PublishDatasetModalProps) {
  const { t } = useTranslation('dataset')
  const navigate = useNavigate()
  const { submissionStatus, submitDeaccession, deaccessionError } = useDeaccessionDataset(
    repository,
    persistentId,
    onDeaccessionSucceed
  )

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<DeaccessionFormData>({ defaultValues: { versions: [], deaccessionForwardUrl: '' } })

  function onDeaccessionSucceed() {
    navigate(
      `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${persistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`,
      {
        state: { publishInProgress: true },
        replace: true
      }
    )
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>Deaccession Dataset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical">
          <div>Warning Text</div>
          <form noValidate={true} onSubmit={handleSubmit(submitDeaccession)}>
            {versionList.length > 1 && (
              <Form.Group>
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
                        {versionList.map((version) => (
                          <Form.Group.Checkbox
                            key={version.versionNumber}
                            id={version.versionNumber}
                            label={version.versionNumber + ' - ' + version.lastUpdatedDate}
                            value={version.versionNumber}
                            checked={field.value.includes(version.versionNumber)}
                            isInvalid={!!errors.versions}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, e.target.value] // Add to array if checked
                                : field.value.filter((val) => val !== e.target.value) // Remove if unchecked

                              field.onChange(newValue)
                            }}
                          />
                        ))}
                        <Form.Group.Feedback type="invalid" className="d-block">
                          {errors.versions?.message}
                        </Form.Group.Feedback>
                      </>
                    )}
                  />
                </div>
              </Form.Group>
            )}
            <Form.Group controlId={'deccessionReason'}>
              <Form.Group.Label required>{t('deaccession.reason.label')}</Form.Group.Label>
              <Controller
                name="deaccessionReason"
                control={control}
                rules={{ required: t('deaccession.reason.validation') }}
                render={({ field: { onChange, ref, value }, fieldState }) => (
                  <>
                    <Form.Group.Select
                      value={value as string}
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
                        {t('deaccession.reasons.legalIssue')}
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
            <Form.Group>
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
            <Form.Group>
              <Form.Group.Label>{t('deaccession.forwardUrl.label')}</Form.Group.Label>
              <Controller
                name="deaccessionForwardUrl"
                control={control}
                rules={{
                  validate: (value) => isValidURL(value) || t('deaccession.forwardUrl.validation')
                }}
                render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                  <>
                    <Form.Group.Input
                      type="text"
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
              {t('publish.continueButton')}
            </Button>
            <Button
              withSpacing
              variant="secondary"
              type="button"
              onClick={handleClose}
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
              {t('publish.cancelButton')}
            </Button>
          </form>
        </Stack>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}
