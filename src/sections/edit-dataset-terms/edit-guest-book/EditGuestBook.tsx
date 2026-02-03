import { useState } from 'react'
import { Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { NotImplementedModal } from '../../not-implemented/NotImplementedModal'
import styles from './EditGuestBook.module.scss'

interface EditGuestBookProps {
  onPreview?: () => void
}

export function EditGuestBook({ onPreview }: EditGuestBookProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const [showNotImplementedModal, setShowNotImplementedModal] = useState(false)

  const handlePreview = () => {
    if (onPreview) {
      onPreview()
    } else {
      setShowNotImplementedModal(true)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowNotImplementedModal(true)
  }

  const handleCloseModal = () => {
    setShowNotImplementedModal(false)
  }

  return (
    <div className={styles['edit-guest-book']}>
      <form onSubmit={handleSubmit}>
        <Row style={{ marginBottom: '1rem' }}>
          <Col sm={4}>
            <Form.Group.Label>{t('editTerms.guestBook.title')}</Form.Group.Label>
          </Col>
          <Col sm={8}>
            <Form.Group.Text>{t('editTerms.guestBook.description')}</Form.Group.Text>
            <Row>
              <Col className={styles['guestbook-option']} sm={10}>
                <Form.Group.Radio
                  defaultChecked
                  name="guestbook"
                  label={t('editTerms.guestBook.testGuestbook')}
                  id="guestbook-test"
                  value="test"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePreview}
                  aria-label={t('editTerms.guestBook.previewButton')}
                  style={{ marginLeft: '1rem' }}>
                  {t('editTerms.guestBook.previewButton')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className={styles['form-actions']}>
          <Button type="submit">{tShared('saveChanges')}</Button>
          <Button variant="secondary" type="button">
            {tShared('cancel')}
          </Button>
        </div>
      </form>

      <NotImplementedModal show={showNotImplementedModal} handleClose={handleCloseModal} />
    </div>
  )
}
