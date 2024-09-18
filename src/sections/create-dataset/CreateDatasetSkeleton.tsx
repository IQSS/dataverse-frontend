import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Col, Row } from '@iqss/dataverse-design-system'
import { BreadcrumbsSkeleton } from '../shared/hierarchy/BreadcrumbsSkeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { MetadataFormSkeleton } from '../shared/form/DatasetMetadataForm/MetadataForm/MetadataFormSkeleton'

export const CreateDatasetSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="create-dataset-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height="40px" width="350px" style={{ marginBottom: 16 }} />

      <SeparationLine />

      <Row style={{ marginBottom: 16 }}>
        <Col sm={6}>
          <Skeleton width={120} />
        </Col>
        <Col sm={6}>
          <Row>
            <Col md={9}>
              <Skeleton width="100%" height={38} />
            </Col>
            <Col md={3}>
              <Skeleton height={38} />
            </Col>
          </Row>
        </Col>
      </Row>

      <MetadataFormSkeleton onEditMode={false} />
    </section>
  </SkeletonTheme>
)
