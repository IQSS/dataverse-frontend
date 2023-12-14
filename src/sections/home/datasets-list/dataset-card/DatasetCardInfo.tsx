import styles from './DatasetCard.module.scss'
import { DateHelper } from '../../../../shared/domain/helpers/DateHelper'
import { DatasetPreview } from '../../../../dataset/domain/models/DatasetPreview'
import { CitationDescription } from '../../../shared/citation/CitationDescription'

interface DatasetCardInfoProps {
  dataset: DatasetPreview
}

export function DatasetCardInfo({ dataset }: DatasetCardInfoProps) {
  return (
    <div className={styles.description}>
      <span className={styles.date}>{DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)}</span>
      <span
        className={
          dataset.isDeaccessioned ? styles['citation-box-deaccessioned'] : styles['citation-box']
        }>
        <CitationDescription citation={dataset.citation} />
      </span>
      <span>{dataset.abbreviatedDescription}</span>
    </div>
  )
}
