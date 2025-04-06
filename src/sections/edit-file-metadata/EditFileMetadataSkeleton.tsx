import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { BreadcrumbsSkeleton } from '@/sections/shared/hierarchy/BreadcrumbsSkeleton'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'

export const EditFileMetadataSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="edit-file-metadata-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height="40px" width="350px" style={{ marginBottom: 16 }} />

      <SeparationLine />

      <Skeleton height="24px" width="350px" style={{ marginBottom: 16 }} />
    </section>
  </SkeletonTheme>
)
