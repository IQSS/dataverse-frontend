import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from './useDataset'
import { Tabs } from '../ui/tabs/Tabs'
import { Col } from '../ui/grid/Col'
import { Row } from '../ui/grid/Row'
import styles from './Dataset.module.scss'
import { DatasetLabels } from './dataset-labels/DatasetLabels'

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
        <DatasetLabels labels={dataset.labels} />
      </header>
      <div className={styles.container}>
        <Row>
          <Col sm={9}>Citation Block</Col>
        </Row>
        <Row>
          <Col sm={9}>Summary Block</Col>
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
