import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const TemplatePreviewModalSkeleton = () => (
  <div data-testid="preview-modal-skeleton">
    <SkeletonTheme>
      <Skeleton height={24} width={220} style={{ marginBottom: 16 }} />
      <Skeleton height={180} />
    </SkeletonTheme>
  </div>
)
