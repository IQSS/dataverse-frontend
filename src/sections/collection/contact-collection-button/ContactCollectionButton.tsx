import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { Envelope } from 'react-bootstrap-icons'
import { ContactModal } from '@/sections/shared/contact-modal/contact-modal'

interface ContactCollectionButtonProps {
  onSuccess: () => void
}
export const ContactCollectionButton = ({ onSuccess }: ContactCollectionButtonProps) => {
  const { t } = useTranslation('collection')
  const { t: tContact } = useTranslation('Contact')

  const [showContactModal, setShowContactModal] = useState(false)

  const openContactModal = () => setShowContactModal(true)
  const closeContactModal = () => setShowContactModal(false)

  return (
    <>
      <Tooltip overlay={t('contact.contactCollection')} placement="top">
        <Button
          variant="link"
          onClick={openContactModal}
          icon={<Envelope style={{ marginRight: '0.3rem', marginBottom: '0.2rem' }} />}>
          {tContact('Contact')}
        </Button>
      </Tooltip>

      <ContactModal
        show={showContactModal}
        handleClose={closeContactModal}
        title={t('contact.contactCollection')}
        onSuccess={onSuccess}
      />
    </>
  )
}
