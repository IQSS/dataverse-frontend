import styles from './DatasetCard.module.scss'
import { DateHelper } from '../../../../shared/domain/helpers/DateHelper'
import { CitationDescription } from '../../../shared/citation/CitationDescription'
import { DatasetPublishingStatus, DatasetVersion } from '../../../../dataset/domain/models/Dataset'

interface DatasetCardInfoProps {
  version: DatasetVersion
  releaseOrCreateDate: Date
  abbreviatedDescription: string
}

export function DatasetCardInfo({
  version,
  releaseOrCreateDate,
  abbreviatedDescription
}: DatasetCardInfoProps) {
  return (
    <div className={styles.description}>
      <span className={styles.date}>{DateHelper.toDisplayFormat(releaseOrCreateDate)}</span>
      <span
        className={
          version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
            ? styles['citation-box-deaccessioned']
            : styles['citation-box']
        }>
        <CitationDescription citation={version.citation} />
      </span>
      <span>{abbreviatedDescription}</span>
    </div>
  )
}
