import { useTranslation } from 'react-i18next'
import { Alert, Col, Row } from '@iqss/dataverse-design-system'
import styles from '../Dataset.module.scss'

export function DatasetNotAuthorized() {
  const { t } = useTranslation('dataset')

  return (
    <article data-testid="not-authorized-container">
      <div className={styles.container}>
        <Row>
          <Col>
            <Alert
              variant="danger"
              customHeading={t('alerts.notAuthorized.heading')}
              dismissible={false}>
              {t('alerts.notAuthorized.alertText')}
            </Alert>
          </Col>
        </Row>
      </div>
    </article>
  )
}
