import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { File } from '../../../files/domain/models/File'
import { FilePreview } from '../file-preview/FilePreview'

interface FileMetadataProps {
  file: File
}

export function FileMetadata({ file }: FileMetadataProps) {
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
              <FilePreview thumbnail={file.thumbnail} type={file.type} name={file.name} />
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
