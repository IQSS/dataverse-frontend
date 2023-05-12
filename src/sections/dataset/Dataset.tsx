import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from './useDataset'
import { Badge } from '../ui/badge/Badge'
import { Tabs } from '../ui/tabs/Tabs'
import { Col } from '../ui/grid/Col'
import { Row } from '../ui/grid/Row'
import styles from './Dataset.module.scss'
import { DatasetSummary } from './datasetSummary/DatasetSummary'
import { DatasetCitation } from './datasetCitation/DatasetCitation'
interface DatasetProps {
  datasetRepository: DatasetRepository
  id: string
}

export function Dataset({ datasetRepository, id }: DatasetProps) {
  const { dataset } = useDataset(datasetRepository, id)

  return dataset ? (
    <article>
      <header className={styles.header}>
        <h1>{dataset.title}</h1>
        <Badge>Version {dataset.version}</Badge>
      </header>
      <div className={styles.container}>
        <Row>
          <Col>
            <DatasetCitation displayCitation={dataset.displayCitation}></DatasetCitation>
          </Col>
        </Row>
        <Row>
          <DatasetSummary
            summaryFields={dataset.summaryFields}
            license={dataset.license}></DatasetSummary>
        </Row>
        <Tabs defaultActiveKey="files">
          <Tabs.Tab eventKey="files" title="Files">
            <div>Files Section</div>
          </Tabs.Tab>
          <Tabs.Tab eventKey="metadata" title="Metadata">
            <div>Metadata Section</div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </article>
  ) : null
}
