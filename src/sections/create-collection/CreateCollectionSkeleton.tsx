import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { BreadcrumbsSkeleton } from '@/sections/shared/hierarchy/BreadcrumbsSkeleton'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'
import { EditCreateCollectionFormSkeleton } from '@/sections/shared/form/EditCreateCollectionForm/EditCreateCollectionFormSkeleton'

export const CreateCollectionSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="create-collection-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height="40px" width="350px" style={{ marginBottom: 16 }} />

      <SeparationLine />

      <Skeleton height="24px" width="350px" style={{ marginBottom: 16 }} />

      <EditCreateCollectionFormSkeleton />
    </section>
  </SkeletonTheme>
)
