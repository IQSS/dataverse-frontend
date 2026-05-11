import { Button, Modal } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface ConfirmDeleteModalProps {
  show: boolean
  handleClose: () => void
  handleContinue: () => void
}

export const ConfirmDeleteModal = ({
  show,
  handleClose,
  handleContinue
}: ConfirmDeleteModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('editFeaturedItems')
  const modalTitle = t('deleteAll.action')

  return (
    <Modal show={show} onHide={handleClose} centered ariaLabel={modalTitle}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('deleteAll.confirmation')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button">
          {tShared('cancel')}
        </Button>
        <Button variant="danger" onClick={handleContinue} type="button">
          {tShared('continue')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
