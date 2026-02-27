import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { BreadcrumbsSkeleton } from '@/sections/shared/hierarchy/BreadcrumbsSkeleton'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'

export const GuestbookSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="guestbooks-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height="40px" width="300px" style={{ marginBottom: 16 }} />

      <SeparationLine />

      <Skeleton height="38px" width="180px" style={{ marginBottom: 16, marginLeft: 'auto' }} />

      <Skeleton height="40px" style={{ marginBottom: 8 }} />
      <Skeleton height="40px" style={{ marginBottom: 8 }} />
      <Skeleton height="40px" />
    </section>
  </SkeletonTheme>
)
