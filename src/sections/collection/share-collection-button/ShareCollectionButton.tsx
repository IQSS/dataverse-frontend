import { useState } from 'react'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { ShareFill } from 'react-bootstrap-icons'
import { SocialShareModal } from '@/sections/shared/social-share-modal/SocialShareModal'

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
          icon={<ShareFill style={{ marginRight: '0.3rem', marginBottom: '0.2rem' }} />}>
          Share
        </Button>
      </Tooltip>

      <SocialShareModal
        show={showShareModal}
        handleClose={closeShareModal}
        title="Share Collection"
        helpText="Share this collection on your favorite social media networks."
      />
    </>
  )
}
