import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PersonWorkspace } from 'react-bootstrap-icons'
import { Button, Col, Form, Modal } from '@iqss/dataverse-design-system'
import { useSession } from '@/sections/session/SessionContext'
import { useGetDefaultPageOptionFromURL, PAGE_OPTIONS } from './useGetDefaultPageOptionFromURL'
import styles from './UserFeedbackCTA.module.scss'

export const UserFeedbackCTA = () => {
  const { t } = useTranslation('shared')
  const defaultPageOption: string | undefined = useGetDefaultPageOptionFromURL()

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
        aria-label="Open feedback form"
        onClick={handleShow}
        className={styles['user-feedback-cta']}>
        <PersonWorkspace size={24} color="white" />
      </button>
      <Modal show={showModal} onHide={handleClose} id="feedback-modal" size="lg" centered>
        <Modal.Header>
          <Modal.Title>Send us your feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Col}>
            <Form.Group.Label>{t('userFeedback.fields.page.label')}</Form.Group.Label>
            <Form.Group.SelectAdvanced
              options={Object.values(PAGE_OPTIONS)}
              defaultValue={defaultPageOption}
              isMultiple={false}
              inputButtonId="feedback-type"
              isSearchable={false}
            />
            <Form.Group.Text>{t('userFeedback.fields.page.helpText')}</Form.Group.Text>
          </Form.Group>

          <Form.Group controlId="user-feedback" as={Col}>
            <Form.Group.Label required>{t('userFeedback.fields.feedback.label')}</Form.Group.Label>
            <Form.Group.TextArea
              placeholder={t('userFeedback.fields.feedback.placeholder')}
              aria-label={t('userFeedback.fields.feedback.placeholder')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} type="button">
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
