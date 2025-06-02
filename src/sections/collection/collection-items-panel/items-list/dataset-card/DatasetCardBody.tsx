import cn from 'classnames'
import { Stack } from '@iqss/dataverse-design-system'
import { DatasetItemTypePreview } from '@/dataset/domain/models/DatasetItemTypePreview'
import { DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { CitationDescription } from '@/sections/shared/citation/CitationDescription'
import { DatasetCardThumbnail } from './DatasetCardThumbnail'
import styles from './DatasetCard.module.scss'

interface DatasetCardBodyProps {
  datasetPreview: DatasetItemTypePreview
}

export const DatasetCardBody = ({ datasetPreview }: DatasetCardBodyProps) => {
  const { version, releaseOrCreateDate, description } = datasetPreview

  return (
    <Stack direction="vertical" gap={2} className={styles['card-body-container']}>
      <Stack direction="horizontal" gap={3}>
        <DatasetCardThumbnail
          persistentId={datasetPreview.persistentId}
          version={datasetPreview.version}
          thumbnail={datasetPreview.thumbnail}
        />
        <Stack direction="vertical" gap={1}>
          <time
            dateTime={releaseOrCreateDate.toLocaleDateString()}
            className={styles['release-or-create-date']}>
            {DateHelper.toDisplayFormat(releaseOrCreateDate)}
          </time>
          <div
            className={cn(styles['citation-box'], {
              [styles['deaccesioned']]:
                version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
            })}>
            <CitationDescription citation={version.citation} />
          </div>
        </Stack>
      </Stack>
      <p className={styles.description}>{description}</p>
    </Stack>
  )
}
