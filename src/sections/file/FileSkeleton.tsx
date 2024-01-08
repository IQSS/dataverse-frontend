import styles from './File.module.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Tabs } from '@iqss/dataverse-design-system'

export function FileSkeleton() {
  return (
    <SkeletonTheme>
      <article data-testid="file-skeleton">
        <header className={styles.header}>
          <h1>
            <Skeleton width="15%" />
          </h1>
          <p className={styles.subtext}>
            <Skeleton width="20%" />
          </p>
          <Skeleton width="10%" />
        </header>
        <div className={styles.container}>
          <Tabs defaultActiveKey="metadata">
            <Tabs.Tab eventKey="metadata" title="Metadata">
              <Skeleton height="1000px" style={{ marginTop: 20 }} />
            </Tabs.Tab>
          </Tabs>
        </div>
      </article>
    </SkeletonTheme>
  )
}
