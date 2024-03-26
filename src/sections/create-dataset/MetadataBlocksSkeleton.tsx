import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export const MetadataBlocksSkeleton = () => {
  return (
    <Accordion defaultActiveKey="0">
      <SkeletonTheme>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Skeleton width="120px" />
          </Accordion.Header>
          <Accordion.Body>
            {Array.from({ length: 4 }).map((_, index) => (
              <Row style={{ marginBottom: '1rem' }} key={index}>
                <Col sm={3}>
                  <Skeleton width="120px" />
                </Col>
                <Col sm={9}>
                  <Skeleton height="40px" />
                </Col>
              </Row>
            ))}
            {Array.from({ length: 3 }).map((_, index) => (
              <Row style={{ marginBottom: '1rem' }} key={index}>
                <Col sm={3}>
                  <Skeleton width="120px" />
                </Col>
                <Col sm={9}>
                  <Row>
                    <Col>
                      <Skeleton width="120px" />
                      <Skeleton height="40px" />
                    </Col>
                    <Col>
                      <Skeleton width="120px" />
                      <Skeleton height="40px" />
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </SkeletonTheme>
    </Accordion>
  )
}
