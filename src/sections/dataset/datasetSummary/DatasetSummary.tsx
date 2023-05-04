import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from '../useDataset'
import { Col } from '../../ui/grid/Col'
import { Row } from '../../ui/grid/Row'

interface DatasetSummaryProps {
  datasetRepository: DatasetRepository
  id: string
}

export function DatasetSummary({ datasetRepository, id }: DatasetSummaryProps) {
  const { dataset } = useDataset(datasetRepository, id)

  return dataset ? (
    <article>
      <Row>
        <Col sm={2}>
          <b>Description</b>:
        </Col>
        <Col> {dataset.description}</Col>
      </Row>
      <Row>
        <Col sm={2}>
          <b>Subject</b>:
        </Col>
        <Col> {dataset.subject}</Col>
      </Row>
      <Row>
        <Col sm={2}>
          <b>Keyword</b>:
        </Col>
        <Col> {dataset.keyword}</Col>
      </Row>
    </article>
  ) : null
}
