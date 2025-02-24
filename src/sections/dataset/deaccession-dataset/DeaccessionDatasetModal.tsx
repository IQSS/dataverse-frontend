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
  } = useForm<DeaccessionFormData>()

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
        <Modal.Title>Publish Dataset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical">
          <div>Warning Text</div>
          <form noValidate={true} onSubmit={handleSubmit(submitDeaccession)}>
            {versionList.length > 1 && (
              <Form.Group controlId={'versions'}>
                <Form.Group.Label required>
                  Which version(s) do you want to deaccession?
                </Form.Group.Label>
                <Controller
                  name="versions"
                  control={control}
                  rules={{ required: 'Please select at least one version to deaccession' }}
                  render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                    <>
                      <Form.CheckboxGroup title={'Versions'}>
                        {versionList.map((version) => (
                          <Form.Group.Checkbox
                            id={version.versionNumber}
                            key={version.versionNumber}
                            label={version.versionNumber + ' ' + version.lastUpdatedDate}
                            value={version.versionNumber}
                          />
                        ))}
                      </Form.CheckboxGroup>
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    </>
                  )}></Controller>
              </Form.Group>
            )}
            <Form.Group controlId={'reason'}>
              <Form.Group.Label required>Why are you deaccessioning this version?</Form.Group.Label>
              <Controller
                name="versions"
                control={control}
                rules={{ required: 'Please select at least one version to deaccession' }}
                render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                  <>
                    <Form.Group.Select>
                      <option>Select...</option>
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                    </Form.Group.Select>
                    <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                  </>
                )}></Controller>
            </Form.Group>
            <Form.Group>
              <Form.Group.Label>
                Please enter additional information about the reason for deaccession.
              </Form.Group.Label>
              <Form.Group.TextArea />
            </Form.Group>
          </form>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  )
}
