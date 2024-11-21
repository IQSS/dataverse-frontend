import { useState } from 'react'
import { Button } from '@iqss/dataverse-design-system'
import { SocialShareModal } from '@/sections/shared/social-share-modal/SocialShareModal'

export const ShareDatasetButton = () => {
  const [showShareModal, setShowShareModal] = useState(false)

  const openShareModal = () => setShowShareModal(true)
  const closeShareModal = () => setShowShareModal(false)

  return (
    <>
      <Button variant="secondary" onClick={openShareModal} size="sm">
        Share
      </Button>

      <SocialShareModal
        show={showShareModal}
        handleClose={closeShareModal}
        title="Share Dataset"
        helpText="Share this dataset on your favorite social media networks."
      />
    </>
  )
}
