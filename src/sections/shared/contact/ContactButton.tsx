import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { Envelope } from 'react-bootstrap-icons'
import { ContactModal } from '@/sections/shared/contact/contact-modal/contact-modal'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'

interface ContactButtonProps {
  toContactName: string
  isCollection: boolean
  id: string | number
  contactRepository: ContactRepository
}

export const ContactButton = ({
  toContactName,
  isCollection,
  id,
  contactRepository
}: ContactButtonProps) => {
  const { t } = useTranslation('shared')
  const [showContactModal, setShowContactModal] = useState(false)
  const openContactModal = () => setShowContactModal(true)
  const closeContactModal = () => setShowContactModal(false)

  return (
    <>
      {isCollection ? (
        <>
          <Tooltip
            overlay={isCollection ? t('contact.contactCollection') : t('contact.contactDataset')}
            placement="top">
            <Button
              variant="link"
              onClick={openContactModal}
              icon={<Envelope style={{ marginRight: '0.3rem', marginBottom: '0.2rem' }} />}>
              {t('contact.title.collection')}
            </Button>
          </Tooltip>

          <ContactModal
            show={showContactModal}
            handleClose={closeContactModal}
            title={t('contact.contactCollection')}
            toContactName={toContactName}
            id={id}
            contactRepository={contactRepository}
          />
        </>
      ) : (
        <>
          <Button variant="secondary" onClick={openContactModal} size="sm">
            {t('contact.title.dataset')}
          </Button>

          <ContactModal
            show={showContactModal}
            handleClose={closeContactModal}
            title={t('contact.contactDataset')}
            toContactName={toContactName}
            id={id}
            contactRepository={contactRepository}
          />
        </>
      )}
    </>
  )
}
