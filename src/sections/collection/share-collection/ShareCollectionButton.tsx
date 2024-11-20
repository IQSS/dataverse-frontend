import { useState } from 'react'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { ShareFill } from 'react-bootstrap-icons'
import { ShareCollectionModal } from './ShareCollectionModal'
import styles from './ShareCollection.module.scss'

export const ShareCollectionButton = () => {
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

      <ShareCollectionModal show={showShareModal} handleClose={closeShareModal} />
    </>
  )
}
