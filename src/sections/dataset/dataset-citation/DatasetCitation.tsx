import { useTranslation } from 'react-i18next'
import { Col, Row, Stack } from '@iqss/dataverse-design-system'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetThumbnail } from '../dataset-thumbnail/DatasetThumbnail'
import { CitationDescription } from '../../shared/citation/CitationDescription'
import { DatasetCitationTooltip } from './DatasetCitationTooltip'
import { CitationLearnAbout } from '../../shared/citation/CitationLearnAbout'
import { CitationDownloadButton } from '@/sections/shared/citation/citation-download/CitationDownloadButton'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import styles from './DatasetCitation.module.scss'

interface DatasetCitationProps {
  datasetRepository: DatasetRepository
  datasetId: string
  thumbnail?: string
  version: DatasetVersion
  withoutThumbnail?: boolean
}

export function DatasetCitation({
  datasetRepository,
  datasetId,
  thumbnail,
  version,
  withoutThumbnail
}: DatasetCitationProps) {
  const { t } = useTranslation('dataset')

  return (
    <>
      <Row
        className={
          version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
            ? styles.deaccessioned
            : styles.container
        }>
        {!withoutThumbnail && (
          <Col sm={2} className={styles.thumbnail}>
            <DatasetThumbnail
              thumbnail={thumbnail}
              title={version.title}
              isDeaccessioned={version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED}
            />
          </Col>
        )}
        <Col sm={withoutThumbnail ? 12 : 10}>
          <CitationDescription
            citation={version.citation}
            tooltip={<DatasetCitationTooltip status={version.publishingStatus} />}
          />
          <Stack direction="horizontal" gap={2} style={{ marginLeft: '-12px' }}>
            <CitationDownloadButton
              datasetRepository={datasetRepository}
              datasetId={datasetId}
              version={version.number.toString()}
            />
            <CitationLearnAbout />
          </Stack>
        </Col>
      </Row>

      {version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED && (
        <Row className={styles.deaccessioned}>
          <Stack>
            <b>{t('deaccessionReason')} </b>
          </Stack>
          <Stack>{version.deaccessionNote} </Stack>
        </Row>
      )}
    </>
  )
}
