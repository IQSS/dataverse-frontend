import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export function BreadcrumbsSkeleton() {
  return (
    <SkeletonTheme>
      <Skeleton width="10%" style={{ marginBottom: 16, marginTop: 8 }} />
    </SkeletonTheme>
  )
}
