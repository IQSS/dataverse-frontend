import styles from './DatasetsList.module.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export function DatasetsListSkeleton() {
  return (
    <SkeletonTheme>
      <section className={styles.container} data-testid="datasets-list-skeleton">
        <div>
          <Skeleton width="14%" />
        </div>
        <article>
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
          <Skeleton height="109px" style={{ marginBottom: 6 }} />
        </article>
      </section>
    </SkeletonTheme>
  )
}
