import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { BreadcrumbsSkeleton } from '../shared/hierarchy/BreadcrumbsSkeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const DatasetTemplatesSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="dataset-templates-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height={32} width={240} style={{ marginBottom: 12 }} />
      <Skeleton height={20} width="100%" style={{ marginBottom: 16 }} />
      <Skeleton height={20} width="85%" style={{ marginBottom: 24 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Skeleton height={38} width={220} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 2fr', gap: 12 }}>
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
      </div>
      <div style={{ marginTop: 12 }}>
        <Skeleton height={36} count={6} />
      </div>
    </section>
  </SkeletonTheme>
)
