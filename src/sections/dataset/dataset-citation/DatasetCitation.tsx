import { Col, IconName, Icon, QuestionMarkTooltip, Row } from 'dataverse-design-system'
import styles from './DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import { DatasetStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import parse from 'html-react-parser'

interface DatasetCitationProps {
  citation: string
  version: DatasetVersion
}

export function DatasetCitation({ citation, version }: DatasetCitationProps) {
  const { t } = useTranslation('dataset')
  return (
    <>
      <Row
        className={
          version.status === DatasetStatus.DEACCESSIONED ? styles.deaccessioned : styles.container
        }>
        <Row className={styles.row}>
          <Col sm={3}>
            <div className={styles.icon}>
              <Icon name={IconName.DATASET} />
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
    </>
  )
}

function CitationDescription({ citation, version }: DatasetCitationProps) {
  const citationAsReactElement = parse(citation)

  return (
    <span className={styles.citation}>
      {citationAsReactElement}
      <CitationTooltip status={version.status} />
    </span>
  )
}

interface CitationDatasetStatusProps {
  status: DatasetStatus
}

function CitationTooltip({ status }: CitationDatasetStatusProps) {
  const { t } = useTranslation('dataset')

  if (status !== DatasetStatus.RELEASED) {
    return (
      <>
        {' '}
        <QuestionMarkTooltip
          placement={'top'}
          message={t(`citation.status.${status}.description`)}
        />
      </>
    )
  }
  return <></>
}
