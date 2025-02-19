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
  const { t } = useTranslation('editCollectionFeaturedItems')

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>{t('deleteAll.action')}</Modal.Title>
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
