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
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
          <Skeleton width="50%" />
        </article>
      </section>
    </SkeletonTheme>
  )
}
