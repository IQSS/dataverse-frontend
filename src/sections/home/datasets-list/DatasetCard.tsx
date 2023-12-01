import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { LinkToPage } from '../../shared/link-to-page/LinkToPage'
import { Route } from '../../Route.enum'
import { DatasetLabels } from '../../dataset/dataset-labels/DatasetLabels'
import styles from './DatasetCard.module.scss'
import { DatasetThumbnail } from '../../dataset/dataset-citation/DatasetThumbnail'
import { DateHelper } from '../../../shared/domain/helpers/DateHelper'
import { CitationDescription } from '../../dataset/dataset-citation/DatasetCitation'

interface DatasetCardProps {
  dataset: DatasetPreview
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: dataset.persistentId }}>
          {dataset.title}
        </LinkToPage>
        <DatasetLabels labels={dataset.labels} />
      </div>
      <div className={styles.info}>
        <div className={styles.thumbnail}>
          <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: dataset.persistentId }}>
            <DatasetThumbnail
              title={dataset.title}
              thumbnail={dataset.thumbnail}
              isDeaccessioned={dataset.isDeaccessioned}
            />
          </LinkToPage>
        </div>
        <div className={styles.description}>
          <span className={styles.date}>
            {DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)}
          </span>
          <span
            className={
              dataset.isDeaccessioned
                ? styles['citation-box-deaccessioned']
                : styles['citation-box']
            }>
            <CitationDescription citation={dataset.citation} version={dataset.version} />
          </span>
        </div>
      </div>
    </article>
  )
}
