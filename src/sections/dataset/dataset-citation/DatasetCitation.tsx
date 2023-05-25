import { Col, Icon, Row, Tooltip } from 'dataverse-design-system'
import styles from './DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import { Citation, DatasetStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'

interface DatasetCitationProps {
  citation: Citation
  status: DatasetStatus
  version: DatasetVersion | null
}
interface CitationDatasetStatusProps {
  status: DatasetStatus
}

function CitationDescription({ citation, status, version }: DatasetCitationProps) {
  return (
    <span className={styles.citation}>
      {citation.citationText}, <a href={citation.pidUrl}>{citation.pidUrl}</a>, {citation.publisher}
      {version && `, V${version.majorNumber}`}
      {citation.unf && `, ${citation.unf}`}
      <CitationDatasetStatus status={status} />
    </span>
  )
}
function CitationDatasetStatus({ status }: CitationDatasetStatusProps) {
  const { t } = useTranslation('dataset')
  if (status !== DatasetStatus.RELEASED) {
    return (
      <span>
        {', '}
        {t(`citation.status.${status}.title`)}{' '}
        <Tooltip placement={'top'} message={t(`citation.status.${status}.description`)} />
      </span>
    )
  }
  return <></>
}

export function DatasetCitation({ citation, status, version }: DatasetCitationProps) {
  const { t } = useTranslation('dataset')
  return (
    <article>
      <Row
        className={
          status === DatasetStatus.DEACCESSIONED ? styles.deaccessioned : styles.container
        }>
        <Row className={styles.row}>
          <Col sm={3}>
            <div className={styles.icon}>
              <span className={Icon.DATASET}></span>
            </div>
          </Col>
          <Col>
            <Row>
              <CitationDescription citation={citation} status={status} version={version} />
            </Row>
            <Row>
              <div>
                {t('citation.learnAbout')}{' '}
                <a
                  className={styles.link}
                  href="https://dataverse.org/best-practices/data-citation"
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('citation.standards')}.
                </a>
              </div>
            </Row>
          </Col>
        </Row>
      </Row>
    </article>
  )
}
