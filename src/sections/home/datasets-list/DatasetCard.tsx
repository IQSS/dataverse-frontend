import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { LinkToPage } from '../../shared/link-to-page/LinkToPage'
import { Route } from '../../Route.enum'
import { DatasetLabels } from '../../dataset/dataset-labels/DatasetLabels'
import styles from './DatasetsList.module.scss'

interface DatasetCardProps {
  dataset: DatasetPreview
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles['card-title']}>
        <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: dataset.persistentId }}>
          {dataset.title}
        </LinkToPage>
        <DatasetLabels labels={dataset.labels} />
      </div>
    </article>
  )
}
