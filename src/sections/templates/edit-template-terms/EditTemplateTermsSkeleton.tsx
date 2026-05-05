import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { BreadcrumbsSkeleton } from '@/sections/shared/hierarchy/BreadcrumbsSkeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const EditTemplateTermsSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="edit-template-terms-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height={32} width={260} style={{ marginBottom: 16 }} />
      <Skeleton height={200} style={{ marginBottom: 16 }} />
      <Skeleton height={200} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <Skeleton height={38} width={140} />
        <Skeleton height={38} width={120} />
      </div>
    </section>
  </SkeletonTheme>
)
