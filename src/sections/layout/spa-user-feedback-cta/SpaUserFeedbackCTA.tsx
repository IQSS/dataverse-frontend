import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatTextFill } from 'react-bootstrap-icons'
import { useSession } from '@/sections/session/SessionContext'
import { SpaUserFeedbackModal } from './spa-user-feedback-modal/SpaUserFeedbackModal'
import styles from './SpaUserFeedbackCTA.module.scss'

// TODO: Connect with JSDataverse Use Case
// TODO: Write unit tests

export const SpaUserFeedbackCTA = () => {
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
        aria-controls="feedback-modal"
        aria-label={t('spaUserFeedback.cta')}
        onClick={handleShow}
        className={styles['spa-user-feedback-cta']}>
        <ChatTextFill size={24} color="white" aria-hidden />
      </button>
      <SpaUserFeedbackModal
        showModal={showModal}
        handleClose={handleClose}
        key={showModal.toString()}
      />
    </>
  )
}
