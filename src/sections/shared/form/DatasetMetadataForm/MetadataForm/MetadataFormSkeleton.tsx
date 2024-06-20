import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { SeparationLine } from '../../../layout/SeparationLine/SeparationLine'
import 'react-loading-skeleton/dist/skeleton.css'

// TODO:ME Check if we can add skeleton css once in the app and if tests still pass
export const MetadataFormSkeleton = ({ onEditMode }: { onEditMode: boolean }) => (
  <SkeletonTheme>
    <div data-testid="metadata-form-loading-skeleton">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
        <Skeleton height={16} width={240} />
        {onEditMode && (
          <div style={{ display: 'flex', gap: 16 }}>
            <Skeleton height={38} width={120} />
            <Skeleton height={38} width={70} />
          </div>
        )}
      </div>

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

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
        <Skeleton height={38} width={120} />

        <Skeleton height={38} width={70} />
      </div>
    </div>
  </SkeletonTheme>
)
