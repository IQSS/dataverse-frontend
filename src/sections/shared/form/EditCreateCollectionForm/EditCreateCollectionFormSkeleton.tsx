import Skeleton from 'react-loading-skeleton'
import { Col, Row, Stack } from '@iqss/dataverse-design-system'
import { SeparationLine } from '../../layout/SeparationLine/SeparationLine'

export const EditCreateCollectionFormSkeleton = () => {
  return (
    <>
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

      {/* Metadata Fields section */}
      <Skeleton height={325} width="100%" style={{ marginBottom: 16 }} />

      {/* Browse/Search Facets section */}
      <Skeleton height={325} width="100%" style={{ marginBottom: 16 }} />

      <Stack direction="horizontal" className="pt-3">
        <Skeleton width={120} height={38} />
        <Skeleton width={120} height={38} />
      </Stack>
    </>
  )
}
