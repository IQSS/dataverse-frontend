import { Link } from 'react-router-dom'
import { Card, Col, Row, Stack } from '@iqss/dataverse-design-system'
import { BoxArrowUpRight, Plus } from 'react-bootstrap-icons'
import { RouteWithParams } from '@/sections/Route.enum'
import styles from './Usage.module.scss'

interface UsageProps {
  collectionId: string
}

export const Usage = ({ collectionId }: UsageProps) => {
  return (
    <Row>
      <Col xs={12} lg={4} className={styles.column_card}>
        <Card className={styles.card}>
          <Card.Body className={styles.card_body}>
            <h5>Deposit and share your data. Get academic credit.</h5>
            <p className="small text-muted">
              Harvard Dataverse is a repository for research data. Deposit data and code here.
            </p>
            <footer className={styles.footer_wrapper}>
              <Link
                to={RouteWithParams.CREATE_DATASET(collectionId)}
                className="btn btn-secondary btn-sm">
                <Stack direction="horizontal" gap={1}>
                  <span className={styles.cta_link_text}>Add a dataset</span> <Plus size={22} />
                </Stack>
              </Link>
            </footer>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} lg={4} className={styles.column_card}>
        <Card className={styles.card}>
          <Card.Body className={styles.card_body}>
            <h5>Organize datasets and gather metrics in your own repository.</h5>
            <p className="small text-muted">
              A collection is a container for all your datasets, files, and metadata.
            </p>
            <footer className={styles.footer_wrapper}>
              <Link
                to={RouteWithParams.CREATE_COLLECTION(collectionId)}
                className="btn btn-secondary btn-sm">
                <Stack direction="horizontal" gap={1}>
                  <span className={styles.cta_link_text}>Add a collection</span> <Plus size={22} />
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
            <h5>Publishing your data is easy on Harvard Dataverse!</h5>
            <p className="small text-muted">
              Learn about getting started creating your own dataverse repository here.
            </p>
            <footer className={styles.footer_wrapper}>
              <a
                href="https://support.dataverse.harvard.edu/"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-secondary btn-sm">
                <Stack direction="horizontal" gap={2}>
                  <span className={styles.cta_link_text}>Getting started</span>
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
