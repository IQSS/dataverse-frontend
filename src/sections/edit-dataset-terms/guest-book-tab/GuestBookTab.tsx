import { Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import styles from './GuestBookTab.module.scss'

interface GuestBookTabProps {
  onPreview?: () => void
}

export function GuestBookTab({ onPreview }: GuestBookTabProps) {
  const { t } = useTranslation('dataset')

  return (
    <div className={styles['guestbook-tab']}>
      <Row>
        <Col sm={3}>
          <h4 className={styles['section-title']}>{t('editTerms.guestBook.title')}</h4>
        </Col>
        <Col sm={9}>
          <div className={styles['section-description']}>
            {t('editTerms.guestBook.description')}
          </div>
          <section className={styles['guestbook-option']}>
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
              onClick={onPreview}
              aria-label={t('editTerms.guestBook.previewButton')}>
              {t('editTerms.guestBook.previewButton')}
            </Button>
          </section>
        </Col>
      </Row>

      {/* Form Actions */}
      <div className={styles['form-actions']}>
        <Button type="submit">{t('editTerms.saveButton')}</Button>
        <Button variant="secondary" type="button">
          {t('editTerms.cancelButton')}
        </Button>
      </div>
    </div>
  )
}
