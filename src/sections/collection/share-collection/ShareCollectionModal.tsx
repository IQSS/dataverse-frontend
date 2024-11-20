import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { Facebook, Linkedin, TwitterX } from 'react-bootstrap-icons'
import styles from './ShareCollection.module.scss'

interface ShareCollectionModalProps {
  show: boolean
  handleClose: () => void
}

// TODO:ME - Add storybook
// TODO:ME - Add component test to check url is correct

export const ShareCollectionModal = ({ show, handleClose }: ShareCollectionModalProps) => {
  const currentUrl = window.location.href

  const shareOnLinkedInURL = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
    currentUrl
  )}`

  const shareOnXURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`

  const shareOnFacebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`

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
          <a
            href={shareOnLinkedInURL}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
            className={`${styles['social-btn']} ${styles.linkedin}`}>
            <Linkedin size={18} />
          </a>

          <a
            href={shareOnXURL}
            target="_blank"
            rel="noreferrer"
            title="X, formerly Twitter"
            aria-label="X, formerly Twitter"
            className={`${styles['social-btn']} ${styles.x}`}>
            <TwitterX size={18} />
          </a>
          <a
            href={shareOnFacebookURL}
            target="_blank"
            rel="noreferrer"
            title="Facebook"
            aria-label="Facebook"
            className={`${styles['social-btn']} ${styles.fb}`}>
            <Facebook size={18} />
          </a>
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
