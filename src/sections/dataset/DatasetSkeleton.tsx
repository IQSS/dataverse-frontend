import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import styles from './Dataset.module.scss'
import { Row, Col, Tabs } from '@iqss/dataverse-design-system'
import { BreadcrumbsSkeleton } from '../shared/hierarchy/BreadcrumbsSkeleton'

export function DatasetSkeleton() {
  return (
    <SkeletonTheme>
      <BreadcrumbsSkeleton />
      <article data-testid="dataset-skeleton">
        <header className={styles.header}>
          <h1>
            <Skeleton width="30%" />
          </h1>
          <Skeleton width="10%" />
        </header>
        <div className={styles.container}>
          <Row>
            <Col sm={9}>
              <Skeleton height="140px" style={{ marginBottom: 10 }} />
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Skeleton height="300px" style={{ marginBottom: 10 }} />
            </Col>
          </Row>
          <TabsSkeleton />
        </div>
      </article>
    </SkeletonTheme>
  )
}

export const TabsSkeleton = () => (
  <Tabs defaultActiveKey="files">
    <Tabs.Tab eventKey="files" title="Files">
      <Skeleton height="1000px" style={{ marginTop: 20 }} />
    </Tabs.Tab>
    <Tabs.Tab eventKey="metadata" title="Metadata">
      <Skeleton height="1000px" style={{ marginTop: 20 }} />
    </Tabs.Tab>
  </Tabs>
)
