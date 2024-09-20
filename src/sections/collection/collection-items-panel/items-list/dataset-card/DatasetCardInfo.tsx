import cn from 'classnames'
import {
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../../dataset/domain/models/Dataset'
import { DateHelper } from '../../../../../shared/helpers/DateHelper'
import { CitationDescription } from '../../../../shared/citation/CitationDescription'
import styles from './DatasetCard.module.scss'

interface DatasetCardInfoProps {
  version: DatasetVersion
  releaseOrCreateDate: Date
  description: string
}

export function DatasetCardInfo({
  version,
  releaseOrCreateDate,
  description
}: DatasetCardInfoProps) {
  return (
    <div className={styles['card-info-container']}>
      <time dateTime={releaseOrCreateDate.toLocaleDateString()} className={styles.date}>
        {DateHelper.toDisplayFormat(releaseOrCreateDate)}
      </time>
      <div
        className={cn(styles['citation-box'], {
          [styles['deaccesioned']]:
            version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
        })}>
        <CitationDescription citation={version.citation} />
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
