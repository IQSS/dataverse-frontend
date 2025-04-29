import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatTextFill } from 'react-bootstrap-icons'
import { useSession } from '@/sections/session/SessionContext'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { SpaUserFeedbackModal } from './spa-user-feedback-modal/SpaUserFeedbackModal'
import styles from './SpaUserFeedbackCTA.module.scss'

interface SpaUserFeedbackCTAProps {
  contactRepository: ContactRepository
}

export const SpaUserFeedbackCTA = ({ contactRepository }: SpaUserFeedbackCTAProps) => {
  const { t } = useTranslation('shared')

  const { user } = useSession()
  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  if (!user) return null

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={t('spaUserFeedback.cta')}
        onClick={handleShow}
        data-testid="spa-user-feedback-cta"
        className={styles['spa-user-feedback-cta']}>
        <ChatTextFill size={24} color="white" aria-hidden />
      </button>
      <SpaUserFeedbackModal
        showModal={showModal}
        handleClose={handleClose}
        contactRepository={contactRepository}
        userEmail={user.email}
        key={showModal.toString()}
      />
    </>
  )
}
