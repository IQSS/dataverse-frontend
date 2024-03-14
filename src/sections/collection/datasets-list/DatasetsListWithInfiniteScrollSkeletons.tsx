import styles from './DatasetsList.module.scss'
import Skeleton from 'react-loading-skeleton'

export const InitialLoadingSkeleton = () => (
  <>
    <div
      className={styles['sticky-pagination-results']}
      data-testid="datasets-list-infinite-scroll-skeleton-header">
      <Skeleton width="17%" />
    </div>
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
  </>
)

export const LoadingSkeleton = () => (
  <>
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
  </>
)
