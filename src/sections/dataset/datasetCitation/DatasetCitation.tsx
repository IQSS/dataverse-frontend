import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from '../useDataset'
import { Col } from '../../ui/grid/Col'
import { Row } from '../../ui/grid/Row'
import styles from './DatasetCitation.module.scss'
import { Icon } from '../../ui/icon.enum'
import MarkdownComponent from '../../ui/markdown/MarkdownComponent'
interface DatasetCitationProps {
  datasetRepository: DatasetRepository
  id: string
}

export function DatasetCitation({ datasetRepository, id }: DatasetCitationProps) {
  const { dataset } = useDataset(datasetRepository, id)

  return dataset ? (
    <article>
      <div className={styles.container}>
        <Row className={styles.row}>
          <Col sm={3}>
            <div className={styles.icon}>
              <span className={Icon.DATASET}></span>
            </div>
          </Col>
          <Col>
            <Row>
              <MarkdownComponent markdown={dataset.displayCitation}></MarkdownComponent>
            </Row>
            <Row>
              <Col sm={3}>Dropdown Citation</Col>
              <Col>
                Learn about{' '}
                <a
                  className={styles.link}
                  href="https://dataverse.org"
                  target="_blank"
                  rel="noopener noreferrer">
                  Data Citation Standards.
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </article>
  ) : null
}
