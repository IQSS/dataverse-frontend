import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from '../useDataset'
import { Col } from '../../ui/grid/Col'
import { Row } from '../../ui/grid/Row'
import { Tooltip } from '../../ui/tooltip/Tooltip'
import MarkdownComponent from '../../ui/markdown/MarkdownComponent'

interface DatasetSummaryProps {
  datasetRepository: DatasetRepository
  id: string
}

export function DatasetSummary({ datasetRepository, id }: DatasetSummaryProps) {
  const { dataset } = useDataset(datasetRepository, id)

  return dataset ? (
    <article>
      {dataset.summaryFields.map((field, index) => (
        <Row key={index}>
          <Col sm={3}>
            <b>{field.title}</b> <Tooltip placement="right" message={field.description}></Tooltip>
          </Col>
          <Col>
            {' '}
            <MarkdownComponent markdown={field.value} />
          </Col>
        </Row>
      ))}
    </article>
  ) : null
}
