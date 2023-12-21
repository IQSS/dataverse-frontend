import styles from './File.module.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

export function FileSkeleton() {
  const { t } = useTranslation('file')
  return (
    <SkeletonTheme>
      <article data-testid="file-skeleton">
        <header className={styles.header}>
          <h1>
            <Skeleton width="15%" />
          </h1>
          <Skeleton width="20%" />
        </header>
        <div className={styles.container}>
          <Row>
            <Col sm={9}>
              <span className={styles['citation-title']}>{t('fileCitationTitle')}</span>
              <Skeleton height="80px" style={{ marginBottom: 20 }} />
              <span className={styles['citation-title']}>{t('datasetCitationTitle')}</span>
              <Skeleton height="80px" style={{ marginBottom: 20 }} />
            </Col>
          </Row>
          <Tabs defaultActiveKey="metadata">
            <Tabs.Tab eventKey="metadata" title="Metadata">
              <></>
            </Tabs.Tab>
          </Tabs>
          <div className={styles['separation-line']}></div>
        </div>
      </article>
    </SkeletonTheme>
  )
}
