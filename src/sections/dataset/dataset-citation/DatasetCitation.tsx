import { Col, Row } from '@iqss/dataverse-design-system'
import styles from './DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetThumbnail } from '../dataset-thumbnail/DatasetThumbnail'
import { CitationDescription } from '../../shared/citation/CitationDescription'
import { DatasetCitationTooltip } from './DatasetCitationTooltip'

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
            <Col sm={2} className={styles.thumbnail}>
              <DatasetThumbnail
                thumbnail={thumbnail}
                title={version.title}
                isDeaccessioned={version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED}
              />
            </Col>
          )}
          <Col>
            <Row>
              <span className={styles.citation}>
                <CitationDescription citation={version.citation} />
                <DatasetCitationTooltip status={version.publishingStatus} />
              </span>
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
