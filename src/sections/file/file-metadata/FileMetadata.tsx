import { Accordion, Col, Row } from '@iqss/dataverse-design-system'

export function FileMetadata() {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>File Metadata</Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col sm={3}>
              <strong>Preview</strong>
            </Col>
            <Col>
              <span>Preview Image</span>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
