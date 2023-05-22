import { Col, Icon, Row, Tooltip } from 'dataverse-design-system'
import styles from './DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import { Citation, DatasetStatus } from '../../../dataset/domain/models/Dataset'

interface DatasetCitationProps {
  citation: Citation
  status: DatasetStatus
  version: string | null
}
interface CitationDatasetStatusProps {
  status: DatasetStatus
}

function CitationDescription({ citation, status, version }: DatasetCitationProps) {
  return (
    <span>
      {citation.citationText}, <a href={citation.pidUrl}>{citation.pidUrl}</a>, {citation.publisher}
      {version && ', V' + version.split('.')[0]}
      {citation.unf && ', ' + citation.unf}
      <CitationDatasetStatus status={status} />
    </span>
  )
}
function CitationDatasetStatus({ status }: CitationDatasetStatusProps) {
  const { t } = useTranslation('dataset')
  if (status !== DatasetStatus.PUBLISHED) {
    return (
      <span>
        {', '}
        {t(status)} <Tooltip placement={'top'} message={t(`${status}.description`)} />
      </span>
    )
  }
  return null // Return null if status is DatasetStatus.PUBLISHED
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
                {t('citationLearnAbout')}{' '}
                <a
                  className={styles.link}
                  href="https://dataverse.org/best-practices/data-citation"
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('citationStandards')}.
                </a>
              </div>
            </Row>
          </Col>
        </Row>
      </Row>
    </article>
  )
}
