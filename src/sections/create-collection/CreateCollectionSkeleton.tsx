import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Col, Row, Stack } from '@iqss/dataverse-design-system'
import { BreadcrumbsSkeleton } from '../shared/hierarchy/BreadcrumbsSkeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'

export const CreateCollectionSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="create-collection-skeleton">
      <BreadcrumbsSkeleton />
      <Skeleton height="40px" width="350px" style={{ marginBottom: 16 }} />

      <SeparationLine />

      <Skeleton height="24px" width="350px" style={{ marginBottom: 16 }} />

      {/* Top fields section skeleton */}
      <Row style={{ marginBottom: 16 }}>
        <Col sm={6}>
          <Skeleton width={120} />
          <Skeleton width="100%" height={38} />
        </Col>
      </Row>
      <Row style={{ marginBottom: 16 }}>
        <Col sm={6}>
          <Skeleton width={120} />
          <Skeleton width="100%" height={38} />
        </Col>

        <Col sm={6}>
          <Skeleton width={120} />
          <Skeleton width="100%" height={38} />
        </Col>
      </Row>
      <Row style={{ marginBottom: 16 }}>
        <Col sm={6}>
          <Skeleton width={120} />
          <Skeleton width="100%" height={38} />
        </Col>

        <Col sm={6}>
          <Skeleton width={120} />
          <Skeleton width="100%" height={38} />
        </Col>
      </Row>
      <Row style={{ marginBottom: 16 }}>
        <Col sm={6}>
          <Col style={{ marginBottom: 16 }}>
            <Skeleton width={120} />
            <Skeleton width="100%" height={38} />
          </Col>

          <Skeleton width={120} />
          <Row>
            <Col md={9}>
              <Skeleton height={38} />
            </Col>
            <Col md={3}>
              <Skeleton width={42} height={42} />
            </Col>
          </Row>
        </Col>

        <Col sm={6}>
          <Skeleton width={120} />
          <Skeleton width="100%" height={130} />
        </Col>
      </Row>

      <SeparationLine />

      <Skeleton height={325} width="100%" style={{ marginBottom: 16 }} />
      <Skeleton height={325} width="100%" style={{ marginBottom: 16 }} />

      <Stack direction="horizontal" className="pt-3">
        <Skeleton width={120} height={38} />
        <Skeleton width={120} height={38} />
      </Stack>
    </section>
  </SkeletonTheme>
)
