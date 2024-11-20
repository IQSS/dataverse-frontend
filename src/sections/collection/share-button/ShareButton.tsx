import { useState } from 'react'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { ShareFill } from 'react-bootstrap-icons'
import { ShareModal } from './ShareModal'
import styles from './ShareButton.module.scss'

export const ShareButton = () => {
  const [showShareModal, setShowShareModal] = useState(false)

  const openShareModal = () => setShowShareModal(true)
  const closeShareModal = () => setShowShareModal(false)

  return (
    <>
      <Tooltip overlay="Share Collection" placement="top">
        <Button
          variant="link"
          onClick={openShareModal}
          className={styles['share-btn']}
          icon={<ShareFill className={styles['share-icon']} />}>
          Share
        </Button>
      </Tooltip>

      <ShareModal show={showShareModal} handleClose={closeShareModal} />
    </>
  )
}
