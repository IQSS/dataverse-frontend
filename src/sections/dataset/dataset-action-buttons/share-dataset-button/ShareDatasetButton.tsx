import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { SocialShareModal } from '@/sections/shared/social-share-modal/SocialShareModal'

export const ShareDatasetButton = () => {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const [showShareModal, setShowShareModal] = useState(false)

  const openShareModal = () => setShowShareModal(true)
  const closeShareModal = () => setShowShareModal(false)

  return (
    <>
      <Button variant="secondary" onClick={openShareModal} size="sm">
        {tShared('share')}
      </Button>

      <SocialShareModal
        shareUrl={window.location.href}
        show={showShareModal}
        handleClose={closeShareModal}
        title={t('datasetActionButtons.share.shareDataset')}
        helpText={t('datasetActionButtons.share.helpText')}
      />
    </>
  )
}
