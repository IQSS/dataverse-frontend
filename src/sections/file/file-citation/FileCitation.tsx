import { Col, Row, Stack } from '@iqss/dataverse-design-system'
import { CitationDescription } from '../../shared/citation/CitationDescription'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetCitationTooltip } from '../../dataset/dataset-citation/DatasetCitationTooltip'
import { CitationLearnAbout } from '../../shared/citation/CitationLearnAbout'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileCitationDownloadButton } from '@/sections/shared/citation/citation-download/FileCitationDownloadButton'
import styles from './FileCitation.module.scss'

interface FileCitationProps {
  citation: string
  datasetVersion: DatasetVersion
  fileRepository: FileRepository
  fileId: string | number
}
export function FileCitation({
  citation,
  datasetVersion,
  fileRepository,
  fileId
}: FileCitationProps) {
  return (
    <Row
      className={
        datasetVersion.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
          ? styles.deaccessioned
          : styles.container
      }>
      <Col>
        <CitationDescription
          citation={citation}
          tooltip={<DatasetCitationTooltip status={datasetVersion.publishingStatus} />}
        />
        <Stack direction="horizontal" gap={2} style={{ marginLeft: '-12px' }}>
          <FileCitationDownloadButton fileRepository={fileRepository} fileId={fileId} />
          <CitationLearnAbout />
        </Stack>
      </Col>
    </Row>
  )
}
