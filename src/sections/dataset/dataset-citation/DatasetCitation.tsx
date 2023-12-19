import { Col, QuestionMarkTooltip, Row } from '@iqss/dataverse-design-system'
import styles from './DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import parse from 'html-react-parser'
import { CitationThumbnail } from './CitationThumbnail'

interface DatasetCitationProps {
  thumbnail?: string
  version: DatasetVersion
  withoutThumbnail?: boolean
}

export function DatasetCitation({ thumbnail, version, withoutThumbnail }: DatasetCitationProps) {
  const { t } = useTranslation('dataset')
  return (
    <>
      <Row
        className={
          version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
            ? styles.deaccessioned
            : styles.container
        }>
        <Row className={styles.row}>
          {!withoutThumbnail && (
            <Col sm={2}>
              <CitationThumbnail
                thumbnail={thumbnail}
                title={version.title}
                publishingStatus={version.publishingStatus}
              />
            </Col>
          )}
          <Col>
            <Row>
              <CitationDescription
                citation={version.citation}
                publishingStatus={version.publishingStatus}
              />
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

function CitationDescription({
  citation,
  publishingStatus
}: {
  citation: string
  publishingStatus: DatasetPublishingStatus
}) {
  const citationAsReactElement = parse(citation)

  return (
    <span className={styles.citation}>
      {citationAsReactElement}
      <CitationTooltip status={publishingStatus} />
    </span>
  )
}

interface CitationDatasetStatusProps {
  status: DatasetPublishingStatus
}

function CitationTooltip({ status }: CitationDatasetStatusProps) {
  const { t } = useTranslation('dataset')

  if (status !== DatasetPublishingStatus.RELEASED) {
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
