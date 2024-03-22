import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { BreadcrumbsSkeleton } from '../shared/hierarchy/BreadcrumbsSkeleton'

export function CollectionSkeleton() {
  return (
    <SkeletonTheme>
      <BreadcrumbsSkeleton />
      <header data-testid="collection-skeleton">
        <h1>
          <Skeleton width="30%" style={{ marginTop: 8 }} />
        </h1>
      </header>
    </SkeletonTheme>
  )
}
