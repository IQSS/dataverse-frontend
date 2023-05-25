import { Row, Col, Tooltip } from 'dataverse-design-system'
import { MarkdownComponent } from '../markdown/MarkdownComponent'
import { DatasetField } from '../../../dataset/domain/models/Dataset'
interface SummaryFieldsProps {
  summaryFields: DatasetField[]
}

export function SummaryFields({ summaryFields }: SummaryFieldsProps) {
  return (
    <>
      {summaryFields.map((field, index) => (
        <Row key={index}>
          <Col sm={3}>
            <b>{field.title}</b> <Tooltip placement="right" message={field.description}></Tooltip>
          </Col>
          <Col>
            <MarkdownComponent markdown={field.value} />
          </Col>
        </Row>
      ))}
    </>
  )
}
