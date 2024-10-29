import { Stack } from '@iqss/dataverse-design-system'
import { CollectionItemTypePreview } from '@/collection/domain/models/CollectionItemTypePreview'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { Route } from '@/sections/Route.enum'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import styles from './CollectionCard.module.scss'

interface CollectionCardInfoProps {
  collectionPreview: CollectionItemTypePreview
  parentCollectionAlias: string
}

export function CollectionCardInfo({
  collectionPreview,
  parentCollectionAlias
}: CollectionCardInfoProps) {
  const isStandingOnParentCollectionPage =
    collectionPreview.parentCollectionAlias === parentCollectionAlias

  return (
    <div className={styles['card-info-container']}>
      <Stack gap={1}>
        <div className={styles['date-link-wrapper']}>
          <time
            dateTime={collectionPreview.releaseOrCreateDate.toLocaleDateString()}
            className={styles.date}>
            {DateHelper.toDisplayFormat(collectionPreview.releaseOrCreateDate)}
          </time>
          {!isStandingOnParentCollectionPage && (
            <LinkToPage
              type={DvObjectType.COLLECTION}
              page={Route.COLLECTIONS}
              searchParams={{ id: collectionPreview.parentCollectionAlias.toString() }}>
              {collectionPreview.parentCollectionName}
            </LinkToPage>
          )}
        </div>

        {collectionPreview.description && (
          <p className={styles.description}>{collectionPreview.description}</p>
        )}
      </Stack>
    </div>
  )
}
