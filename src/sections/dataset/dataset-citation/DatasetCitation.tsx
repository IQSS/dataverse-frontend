import { Col, Icon, Row, Tooltip } from 'dataverse-design-system'
import styles from './DatasetCitation.module.scss'

import { Citation, CitationStatus } from '../../../dataset/domain/models/Dataset'

interface DatasetCitationProps {
  citation: Citation
}

function mapAuthors(authors: string[]): string[] {
  return authors.map((author, index) => {
    // If this is the last author in the array, don't add a semi-colon
    if (index === authors.length - 1) {
      return author
    }
    // Otherwise, add a semi-colon after the author
    return `${author}; `
  })
}
function getCitationText(citation: Citation) {
  return (
    <div>
      {citation.value}
      {citation.status === CitationStatus.DRAFT && (
        <span>
          {' '}
          <Tooltip
            placement={'top'}
            message={
              'DRAFT VERSION will be replaced in the citation with the selected version once the dataset has been published.'
            }
          />
        </span>
      )}
      {citation.status === CitationStatus.DEACCESSIONED && (
        <span>
          {', '}
          DEACCESSIONED VERSION{' '}
          <Tooltip
            placement={'top'}
            message={
              'DEACCESSIONED VERSION has been added to the citation for this version since it is no longer available.'
            }
          />
        </span>
      )}
    </div>
  )
}
export function DatasetCitation({ citation }: DatasetCitationProps) {
  return citation ? (
    <article>
      <div
        className={
          citation.status === CitationStatus.DEACCESSIONED ? styles.deaccessioned : styles.container
        }>
        <Row className={styles.row}>
          <Col sm={3}>
            <div className={styles.icon}>
              <span className={Icon.DATASET}></span>
            </div>
          </Col>
          <Col>
            <Row>{getCitationText(citation)}</Row>
            <Row>
              <div>
                Learn about{' '}
                <a
                  className={styles.link}
                  href="https://dataverse.org/best-practices/data-citation"
                  target="_blank"
                  rel="noopener noreferrer">
                  Data Citation Standards.
                </a>
              </div>
            </Row>
          </Col>
        </Row>
      </div>
    </article>
  ) : null
}
