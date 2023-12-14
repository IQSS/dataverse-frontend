import { Col, Row } from '@iqss/dataverse-design-system'
import styles from './DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetThumbnail } from './DatasetThumbnail'
import { CitationDescription } from '../../shared/citation/CitationDescription'

interface DatasetCitationProps {
  thumbnail?: string
  title: string
  citation: string
  version: DatasetVersion
}

export function DatasetCitation({ thumbnail, title, citation, version }: DatasetCitationProps) {
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
          <Col sm={2} className={styles.thumbnail}>
            <DatasetThumbnail
              thumbnail={thumbnail}
              title={title}
              isDeaccessioned={version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED}
            />
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
