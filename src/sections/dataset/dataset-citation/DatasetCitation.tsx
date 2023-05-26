import { Col, Icon, Row, Tooltip } from 'dataverse-design-system'
import styles from './DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import {
  DatasetCitation as DatasetCitationModel,
  DatasetStatus,
  DatasetVersion
} from '../../../dataset/domain/models/Dataset'

interface DatasetCitationProps {
  citation: DatasetCitationModel
  version: DatasetVersion
}

export function DatasetCitation({ citation, version }: DatasetCitationProps) {
  const { t } = useTranslation('dataset')
  return (
    <article>
      <Row
        className={
          version.status === DatasetStatus.DEACCESSIONED ? styles.deaccessioned : styles.container
        }>
        <Row className={styles.row}>
          <Col sm={3}>
            <div className={styles.icon}>
              <span className={Icon.DATASET}></span>
            </div>
          </Col>
          <Col>
            <Row>
              <CitationDescription citation={citation} version={version} />
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

function CitationDescription({ citation, version }: DatasetCitationProps) {
  return (
    <span className={styles.citation}>
      {citation.citationText}, <a href={citation.url}>{citation.url}</a>, {citation.publisher}
      {version.status !== DatasetStatus.DRAFT && `, ${version.toStringMajor()}`}
      {citation.unf && `, ${citation.unf}`}
      <CitationDatasetStatus status={version.status} />
    </span>
  )
}

interface CitationDatasetStatusProps {
  status: DatasetStatus
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
