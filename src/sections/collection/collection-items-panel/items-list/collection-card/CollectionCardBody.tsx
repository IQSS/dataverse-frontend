import { Stack } from '@iqss/dataverse-design-system'
import { CollectionItemTypePreview } from '@/collection/domain/models/CollectionItemTypePreview'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Route } from '@/sections/Route.enum'
import { CollectionCardThumbnail } from './CollectionCardThumbnail'
import { DateHelper } from '@/shared/helpers/DateHelper'
import styles from './CollectionCard.module.scss'

interface CollectionCardBodyProps {
  collectionPreview: CollectionItemTypePreview
  parentCollectionAlias?: string
}

// TODO:ME - Add unit test for dataset card parent collection link.

export const CollectionCardBody = ({
  collectionPreview,
  parentCollectionAlias
}: CollectionCardBodyProps) => {
  const isStandingOnParentCollectionPage =
    !!parentCollectionAlias && collectionPreview.parentCollectionAlias === parentCollectionAlias

  return (
    <Stack direction="horizontal" gap={3} className={styles['card-body-container']}>
      <CollectionCardThumbnail collectionPreview={collectionPreview} />
      <Stack direction="vertical" gap={1}>
        <Stack direction="horizontal" gap={1}>
          <time
            dateTime={collectionPreview.releaseOrCreateDate.toLocaleDateString()}
            className={styles['release-or-create-date']}>
            {DateHelper.toDisplayFormat(collectionPreview.releaseOrCreateDate)}
          </time>
          {!isStandingOnParentCollectionPage && (
            <span className={styles['link-to-collection-wrapper']}>
              <span>- </span>
              <LinkToPage
                type={DvObjectType.COLLECTION}
                page={Route.COLLECTIONS}
                searchParams={{ id: collectionPreview.parentCollectionAlias?.toString() }}>
                {collectionPreview.parentCollectionName}
              </LinkToPage>
            </span>
          )}
        </Stack>

        {collectionPreview.description && (
          <p className={styles.description}>{collectionPreview.description}</p>
        )}
      </Stack>
    </Stack>
  )
}
