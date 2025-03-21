import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row, Stack } from '@iqss/dataverse-design-system'
import { BoxArrowUpRight, Plus } from 'react-bootstrap-icons'
import { RouteWithParams } from '@/sections/Route.enum'
import styles from './Usage.module.scss'

interface UsageProps {
  collectionId: string
}

export const Usage = ({ collectionId }: UsageProps) => {
  const { t } = useTranslation('homepage', { keyPrefix: 'usage' })

  return (
    <Row>
      <Col xs={12} lg={4} className={styles.column_card}>
        <Card className={styles.card}>
          <Card.Body className={styles.card_body}>
            <h5>{t('datasets.title')}</h5>
            <p className="small text-muted">{t('datasets.content')}</p>
            <footer className={styles.footer_wrapper}>
              <Link
                to={RouteWithParams.CREATE_DATASET(collectionId)}
                className="btn btn-secondary btn-sm">
                <Stack direction="horizontal" gap={1}>
                  <span className={styles.cta_link_text}>{t('datasets.text_button')}</span>{' '}
                  <Plus size={22} />
                </Stack>
              </Link>
            </footer>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} lg={4} className={styles.column_card}>
        <Card className={styles.card}>
          <Card.Body className={styles.card_body}>
            <h5>{t('collections.title')}</h5>
            <p className="small text-muted">{t('collections.content')}</p>
            <footer className={styles.footer_wrapper}>
              <Link
                to={RouteWithParams.CREATE_COLLECTION(collectionId)}
                className="btn btn-secondary btn-sm">
                <Stack direction="horizontal" gap={1}>
                  <span className={styles.cta_link_text}>{t('collections.text_button')}</span>{' '}
                  <Plus size={22} />
                </Stack>
              </Link>
            </footer>
          </Card.Body>
        </Card>
      </Col>

      {/* TODO: This column might be only for Harvard Dataverse */}
      <Col xs={12} lg={4} className={styles.column_card}>
        <Card className={styles.card}>
          <Card.Body className={styles.card_body}>
            <h5>{t('general.title')}</h5>
            <p className="small text-muted">{t('general.content')}</p>
            <footer className={styles.footer_wrapper}>
              <a
                href="https://support.dataverse.harvard.edu/"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-secondary btn-sm">
                <Stack direction="horizontal" gap={2}>
                  <span className={styles.cta_link_text}>{t('general.text_button')}</span>
                  <BoxArrowUpRight size={14} />
                </Stack>
              </a>
            </footer>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
