import { Alert, Button, Modal } from '@iqss/dataverse-design-system'

interface ConfirmResetModificationsModalProps {
  showModal: boolean
  onContinue: () => void
  onCancel: () => void
}

export const ConfirmResetModificationsModal = ({
  showModal,
  onContinue,
  onCancel
}: ConfirmResetModificationsModalProps) => (
  <Modal show={showModal} onHide={onCancel} size="xl">
    <Modal.Header>
      <Modal.Title>Reset Modifications</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Alert variant="warning" dismissible={false}>
        Are you sure you want to reset the selected metadata fields? If you do this, any
        customizations (hidden, required, optional) you have done will no longer appear.
      </Alert>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onContinue} data-testid="confirm-reset-modal-continue">
        Continue
      </Button>
      <Button variant="secondary" onClick={onCancel} data-testid="confirm-reset-modal-cancel">
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
)
