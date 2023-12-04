import styles from './DatasetCard.module.scss'
import { DatasetPreview } from '../../../../dataset/domain/models/DatasetPreview'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetThumbnail } from '../../../dataset/dataset-citation/DatasetThumbnail'

interface DatasetCardThumbnailProps {
  dataset: DatasetPreview
}

export function DatasetCardThumbnail({ dataset }: DatasetCardThumbnailProps) {
  return (
    <div className={styles.thumbnail}>
      <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: dataset.persistentId }}>
        <DatasetThumbnail
          title={dataset.title}
          thumbnail={dataset.thumbnail}
          isDeaccessioned={dataset.isDeaccessioned}
        />
      </LinkToPage>
    </div>
  )
}
