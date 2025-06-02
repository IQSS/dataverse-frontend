import cn from 'classnames'
import { Stack } from '@iqss/dataverse-design-system'
import { DatasetItemTypePreview } from '@/dataset/domain/models/DatasetItemTypePreview'
import { DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { CitationDescription } from '@/sections/shared/citation/CitationDescription'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { DatasetCardThumbnail } from './DatasetCardThumbnail'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Route } from '@/sections/Route.enum'
import styles from './DatasetCard.module.scss'

interface DatasetCardBodyProps {
  datasetPreview: DatasetItemTypePreview
  parentCollectionAlias?: string
}

export const DatasetCardBody = ({
  datasetPreview,
  parentCollectionAlias
}: DatasetCardBodyProps) => {
  const { version, releaseOrCreateDate, description } = datasetPreview

  const isStandingOnParentCollectionPage =
    !!parentCollectionAlias && datasetPreview.parentCollectionAlias === parentCollectionAlias

  return (
    <Stack direction="vertical" gap={2} className={styles['card-body-container']}>
      <Stack direction="horizontal" gap={3} style={{ alignItems: 'flex-start' }}>
        <DatasetCardThumbnail
          persistentId={datasetPreview.persistentId}
          version={datasetPreview.version}
          thumbnail={datasetPreview.thumbnail}
        />
        <Stack direction="vertical" gap={1}>
          <Stack direction="horizontal" gap={1}>
            <time
              dateTime={releaseOrCreateDate.toLocaleDateString()}
              className={styles['release-or-create-date']}>
              {DateHelper.toDisplayFormat(releaseOrCreateDate)}
            </time>

            {!isStandingOnParentCollectionPage && (
              <span className={styles['link-to-collection-wrapper']}>
                <span>- </span>
                <LinkToPage
                  type={DvObjectType.COLLECTION}
                  page={Route.COLLECTIONS}
                  searchParams={{ id: datasetPreview.parentCollectionAlias?.toString() }}>
                  {datasetPreview.parentCollectionName}
                </LinkToPage>
              </span>
            )}
          </Stack>

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
