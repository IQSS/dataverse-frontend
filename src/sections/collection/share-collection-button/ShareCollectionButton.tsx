import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { ShareFill } from 'react-bootstrap-icons'
import { SocialShareModal } from '@/sections/shared/social-share-modal/SocialShareModal'

export const ShareCollectionButton = () => {
  const { t } = useTranslation('collection')
  const { t: tShared } = useTranslation('shared')

  const [showShareModal, setShowShareModal] = useState(false)

  const openShareModal = () => setShowShareModal(true)
  const closeShareModal = () => setShowShareModal(false)

  return (
    <>
      <Tooltip overlay={t('share.shareCollection')} placement="top">
        <Button
          variant="link"
          onClick={openShareModal}
          icon={<ShareFill style={{ marginRight: '0.3rem', marginBottom: '0.2rem' }} />}>
          {tShared('share')}
        </Button>
      </Tooltip>

      <SocialShareModal
        shareUrl={window.location.href}
        show={showShareModal}
        handleClose={closeShareModal}
        title={t('share.shareCollection')}
        helpText={t('share.helpText')}
      />
    </>
  )
}
