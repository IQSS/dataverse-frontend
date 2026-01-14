import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Col, Row } from '@iqss/dataverse-design-system'
import { BreadcrumbsSkeleton } from '@/sections/shared/hierarchy/BreadcrumbsSkeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const EditDatasetTemplateMetadataSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="edit-dataset-template-metadata-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height={32} width={260} style={{ marginBottom: 16 }} />

      <Row style={{ marginBottom: 16 }}>
        <Col sm={3}>
          <Skeleton width={140} />
        </Col>
        <Col sm={9}>
          <Skeleton height={38} />
        </Col>
      </Row>

      <Skeleton height={16} width={220} style={{ marginBottom: 16 }} />
      <Skeleton height={200} />
    </section>
  </SkeletonTheme>
)
