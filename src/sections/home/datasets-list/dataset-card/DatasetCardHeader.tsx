import styles from './DatasetCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'
import { DatasetPreview } from '../../../../dataset/domain/models/DatasetPreview'
import { DatasetIcon } from '../../../dataset/dataset-icon/DatasetIcon'

interface DatasetCardHeaderProps {
  dataset: DatasetPreview
}
export function DatasetCardHeader({ dataset }: DatasetCardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: dataset.persistentId }}>
          {dataset.title}
        </LinkToPage>
        <DatasetLabels labels={dataset.labels} />
      </div>
      <div className={styles.icon}>
        <DatasetIcon />
      </div>
    </div>
  )
}
