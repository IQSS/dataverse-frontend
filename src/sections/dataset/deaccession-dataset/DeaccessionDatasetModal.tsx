import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import { Alert, Button, Col, Form, Modal, Stack } from '@iqss/dataverse-design-system'
import { useDataset } from '../DatasetContext'
import { Deaccessioned } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { isValidURL } from '@/metadata-block-info/domain/models/fieldValidations'
import { useGetDatasetVersionsSummaries } from '../dataset-versions/useGetDatasetVersionsSummaries'
import { DeaccessionFormData } from './DeaccessionFormData'
import { ConfirmationModal } from './ConfirmationModal'
import { useDeaccessionDataset } from './useDeaccessionDataset'

interface DeaccessionDatasetModalProps {
  datasetRepository: DatasetRepository
  datasetPersistentId: string
  show: boolean
  handleCloseDeaccessionModal: () => void
}

export function DeaccessionDatasetModal({
  datasetRepository,
  datasetPersistentId,
  show,
  handleCloseDeaccessionModal
}: DeaccessionDatasetModalProps) {
  const { t } = useTranslation(['dataset', 'shared'])
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { refreshDataset } = useDataset()

  const {
    datasetVersionSummaries,
    isLoading: isLoadingDatasetVersionSummaries,
    fetchSummaries
  } = useGetDatasetVersionsSummaries({
    datasetRepository,
    persistentId: datasetPersistentId,
    autoFetch: false
  })

  const publishedVersions =
    datasetVersionSummaries?.filter((version) => {
      const summary = version?.summary as { deaccessioned: Deaccessioned }
      return version.publishedOn && !summary?.deaccessioned
    }) || []

  const defaultVersions = publishedVersions.length === 1 ? [publishedVersions[0].versionNumber] : []

  const { submissionStatus, submitDeaccession, deaccessionError } = useDeaccessionDataset(
    datasetRepository,
    datasetPersistentId,
    onDeaccessionSucceed
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<DeaccessionFormData>({
    values: {
      versions: defaultVersions,
      deaccessionForwardUrl: '',
      deaccessionReason: '',
      deaccessionReasonOther: ''
    }
  })

  function onDeaccessionSucceed() {
    setShowConfirmationModal(false)
    refreshDataset()
    toast.success('Dataset deaccessioned successfully')
  }

  // Get version summaries only when modal is shown and if we dont have the data already
  useEffect(() => {
    if (show && !datasetVersionSummaries) {
      void fetchSummaries()
    }
  }, [show, datasetVersionSummaries, fetchSummaries])

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false)
  }

  const handleSubmitForm = () => {
    handleCloseDeaccessionModal()
    setShowConfirmationModal(true)
  }

  const handleConfirmDeaccession = () => {
    const formData = watch()
    submitDeaccession(formData)
  }

  const isValidNonEmptyURL = (value: string): boolean => {
    if (value.trim() === '') {
      return true // Consider empty strings as valid
    }
    return isValidURL(value)
  }

  const handleCloseWithReset = () => {
    handleCloseDeaccessionModal()
    reset()
  }

  return (
    <>
      <Modal show={show} onHide={handleCloseWithReset} size="lg">
        <Modal.Header>
          <Modal.Title>Deaccession Dataset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoadingDatasetVersionSummaries ? (
            <DeaccessionDatasetModalSkeleton />
          ) : (
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
              <form noValidate={true} onSubmit={handleSubmit(handleSubmitForm)}>
                {publishedVersions.length > 1 && (
                  <Form.Group as={Col}>
                    <Form.Group.Label required>{t('deaccession.version.label')}</Form.Group.Label>
                    <div data-testid="published-versions">
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
                                    label={`${version.versionNumber} - ${version.publishedOn}`}
                                    value={version.versionNumber}
                                    checked={field.value.includes(version.versionNumber)}
                                    isInvalid={!!errors.versions}
                                    onChange={(e) => {
                                      const newValue = e.target.checked
                                        ? [...field.value, e.target.value]
                                        : field.value.filter((val) => val !== e.target.value)
                                      field.onChange(newValue)
                                    }}
                                  />
                                )
                            )}
                            {errors.versions?.message && (
                              <Form.Group.Feedback type="invalid" style={{ display: 'block' }}>
                                {errors.versions?.message}
                              </Form.Group.Feedback>
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
                    render={({
                      field: { onChange, ref, value },
                      fieldState: { invalid, error }
                    }) => (
                      <>
                        <Form.Group.TextArea
                          value={value}
                          onChange={onChange}
                          isInvalid={invalid}
                          rows={2}
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
                    render={({
                      field: { onChange, ref, value },
                      fieldState: { invalid, error }
                    }) => (
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
              </form>
            </Stack>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button withSpacing variant="secondary" type="button" onClick={handleCloseWithReset}>
            {t('cancel', { ns: 'shared' })}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit(handleSubmitForm)}
            disabled={isLoadingDatasetVersionSummaries}>
            {t('continue', { ns: 'shared' })}
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmationModal
        submissionStatus={submissionStatus}
        deaccessionError={deaccessionError}
        show={showConfirmationModal}
        onConfirm={handleConfirmDeaccession}
        onCancel={handleCancelConfirmation}
      />
    </>
  )
}

const DeaccessionDatasetModalSkeleton = () => (
  <SkeletonTheme>
    <div data-testid="deaccession-dataset-modal-skeleton">
      <Skeleton width="100%" height={82} style={{ marginBottom: 16 }} />
      <Col style={{ marginBottom: 16 }}>
        <Skeleton width={160} />
        <Skeleton width="100%" height={38} />
      </Col>
      <Col style={{ marginBottom: 16 }}>
        <Skeleton width={260} />
        <Skeleton width="100%" height={62} />
      </Col>
      <Col style={{ marginBottom: 16 }}>
        <Skeleton width={260} />
        <Skeleton width="100%" height={38} />
      </Col>
    </div>
  </SkeletonTheme>
)
