import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import 'react-loading-skeleton/dist/skeleton.css'

export const DatasetFormSkeleton = () => {
  return (
    <SkeletonTheme>
      <div>
        <Skeleton height={16} width={240} style={{ marginBottom: 16 }} />
        <Accordion defaultActiveKey="0" data-testid="dataset-form-skeleton">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <Skeleton width={120} />
            </Accordion.Header>
            <Accordion.Body>
              {Array.from({ length: 4 }).map((_, index) => (
                <Row style={{ marginBottom: 16 }} key={index}>
                  <Col sm={3}>
                    <Skeleton width={120} />
                  </Col>
                  <Col sm={9}>
                    <Row>
                      <Col sm={9}>
                        <Skeleton height={38} />
                      </Col>
                      {index === 2 && (
                        <Col sm={3}>
                          <Skeleton width={38} height={38} />
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              ))}
              {Array.from({ length: 3 }).map((_, index) => (
                <Row style={{ marginBottom: 24 }} key={index}>
                  <Col sm={3}>
                    <Skeleton width={120} />
                  </Col>
                  <Col sm={9}>
                    <Row>
                      <Col sm={9}>
                        <Row style={{ marginBottom: 16 }}>
                          <Col>
                            <Skeleton width={120} />
                            <Skeleton height={38} />
                          </Col>
                          <Col>
                            <Skeleton width={120} />
                            <Skeleton height={38} />
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3} style={{ marginTop: 24 }}>
                        <Skeleton width={38} height={38} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <SeparationLine />
        <Skeleton height={58} style={{ marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 16 }}>
          <Skeleton height={38} width={120} />

          <Skeleton height={38} width={70} />
        </div>
      </div>
    </SkeletonTheme>
  )
}
