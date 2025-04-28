import { Modal, Button, Alert, Spinner, Stack } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus } from '@/sections/shared/form/DatasetMetadataForm/useSubmitDataset'

interface ConfirmationModalProps {
  show: boolean
  submissionStatus: SubmissionStatus
  deaccessionError: string | null
  isDeaccessioning: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  show,
  submissionStatus,
  deaccessionError,
  isDeaccessioning,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const { t } = useTranslation(['dataset', 'shared'])

  return (
    <Modal size={'lg'} show={show} onHide={onCancel}>
      <Modal.Header>
        <Modal.Title>{t('confirmDeaccession.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant={'warning'} dismissible={false}>
          {t('confirmDeaccession.message')}
        </Alert>
        {submissionStatus === SubmissionStatus.Errored && (
          <Alert variant={'danger'} dismissible={false}>
            {deaccessionError}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm} disabled={isDeaccessioning}>
          <Stack direction="horizontal" gap={1}>
            {t('yes', { ns: 'shared' })}
            {isDeaccessioning && (
              <Spinner variant="light" animation="border" size="sm" data-testid="loading-spinner" />
            )}
          </Stack>
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isDeaccessioning}>
          {t('no', { ns: 'shared' })}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
