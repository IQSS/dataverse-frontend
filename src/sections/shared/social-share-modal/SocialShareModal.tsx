import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { Facebook, Linkedin, TwitterX } from 'react-bootstrap-icons'
import styles from './SocialShareModal.module.scss'

// TODO:ME - Add storybook
// TODO:ME - Add component test to check url is correct

interface SocialShareModalProps {
  show: boolean
  title: string
  helpText: string
  handleClose: () => void
}

export const SocialShareModal = ({ show, title, helpText, handleClose }: SocialShareModalProps) => {
  const { t } = useTranslation('shared')

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
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles['help-block']}>{helpText}</p>

        <Stack direction="horizontal">
          <a
            href={shareOnLinkedInURL}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
            aria-label="Share on LinkedIn"
            className={`${styles['social-btn']} ${styles.linkedin}`}>
            <Linkedin size={18} />
          </a>

          <a
            href={shareOnXURL}
            target="_blank"
            rel="noreferrer"
            title="X, formerly Twitter"
            aria-label="Share on X, formerly Twitter"
            className={`${styles['social-btn']} ${styles.x}`}>
            <TwitterX size={18} />
          </a>
          <a
            href={shareOnFacebookURL}
            target="_blank"
            rel="noreferrer"
            title="Facebook"
            aria-label="Share on Facebook"
            className={`${styles['social-btn']} ${styles.fb}`}>
            <Facebook size={18} />
          </a>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="submit">
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
