import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { Facebook, Linkedin, TwitterX } from 'react-bootstrap-icons'
import styles from './ShareButton.module.scss'

interface ShareModalProps {
  show: boolean
  handleClose: () => void
}

export const ShareModal = ({ show, handleClose }: ShareModalProps) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Share Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles['help-block']}>
          Share this collection on your favorite social media networks.
        </p>

        <Stack direction="horizontal">
          <button
            type="button"
            aria-label="LinkedIn"
            title="LinkedIn"
            className={`${styles['social-btn']} ${styles.linkedin}`}>
            <Linkedin size={18} />
          </button>
          <button
            type="button"
            aria-label="X, formerly Twitter"
            title="X, formerly Twitter"
            className={`${styles['social-btn']} ${styles.x}`}>
            <TwitterX size={18} />
          </button>
          <button
            type="button"
            aria-label="Facebook"
            title="Facebook"
            className={`${styles['social-btn']} ${styles.fb}`}>
            <Facebook size={18} />
          </button>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="submit">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
