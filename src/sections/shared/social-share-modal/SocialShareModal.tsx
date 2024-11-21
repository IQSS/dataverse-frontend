import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { Facebook, Linkedin, TwitterX } from 'react-bootstrap-icons'
import styles from './SocialShareModal.module.scss'

export const LINKEDIN_SHARE_URL = 'https://www.linkedin.com/shareArticle?url='
export const X_SHARE_URL = 'https://x.com/intent/post?url='
export const FACEBOOK_SHARE_URL = 'https://www.facebook.com/sharer/sharer.php?u='

interface SocialShareModalProps {
  show: boolean
  title: string
  helpText: string
  shareUrl: string
  handleClose: () => void
}

export const SocialShareModal = ({
  show,
  title,
  helpText,
  shareUrl,
  handleClose
}: SocialShareModalProps) => {
  const { t } = useTranslation('shared')

  const shareOnLinkedInURL = `${LINKEDIN_SHARE_URL}${encodeURIComponent(shareUrl)}`

  const shareOnXURL = `${X_SHARE_URL}${encodeURIComponent(shareUrl)}`

  const shareOnFacebookURL = `${FACEBOOK_SHARE_URL}${encodeURIComponent(shareUrl)}`

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
