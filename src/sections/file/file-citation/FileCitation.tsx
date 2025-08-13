import { Col, Row } from '@iqss/dataverse-design-system'
import { CitationDescription } from '../../shared/citation/CitationDescription'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetCitationTooltip } from '../../dataset/dataset-citation/DatasetCitationTooltip'
import { CitationLearnAbout } from '../../shared/citation/CitationLearnAbout'
import styles from './FileCitation.module.scss'

interface FileCitationProps {
  citation: string
  datasetVersion: DatasetVersion
}
export function FileCitation({ citation, datasetVersion }: FileCitationProps) {
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
        <CitationLearnAbout />
      </Col>
    </Row>
  )
}
