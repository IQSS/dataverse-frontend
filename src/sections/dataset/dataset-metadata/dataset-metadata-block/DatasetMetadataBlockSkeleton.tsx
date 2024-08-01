import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export const DatasetMetadataBlockSkeleton = () => {
  return (
    <SkeletonTheme>
      <div data-testid="dataset-metadata-block-skeleton">
        <Accordion.Header>
          <Skeleton width={160} height={20} />
        </Accordion.Header>
        <Accordion.Body>
          <Row style={{ marginBottom: '1rem' }}>
            <Col sm={3}>
              <Skeleton height={20} width={160} />
            </Col>
            <Col sm={9}>
              <Skeleton height={20} width={220} />
            </Col>
          </Row>
          <Row style={{ marginBottom: '1rem' }}>
            <Col sm={3}>
              <Skeleton height={20} width={160} />
            </Col>
            <Col sm={9}>
              <Skeleton height={20} width={220} />
            </Col>
          </Row>
          <Row style={{ marginBottom: '1rem' }}>
            <Col sm={3}>
              <Skeleton height={20} width={160} />
            </Col>
            <Col sm={9}>
              <Skeleton height={20} width={220} />
            </Col>
          </Row>
        </Accordion.Body>
      </div>
    </SkeletonTheme>
  )
}
