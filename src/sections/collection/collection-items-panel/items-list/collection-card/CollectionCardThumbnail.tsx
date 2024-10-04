import { Icon, IconName } from '@iqss/dataverse-design-system'
import { CollectionItemTypePreview } from '@/collection/domain/models/CollectionItemTypePreview'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Route } from '@/sections/Route.enum'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import styles from './CollectionCard.module.scss'

interface CollectionCardCardThumbnailProps {
  collectionPreview: CollectionItemTypePreview
}

export function CollectionCardThumbnail({ collectionPreview }: CollectionCardCardThumbnailProps) {
  return (
    <div className={styles['card-thumbnail-container']}>
      <LinkToPage
        type={DvObjectType.COLLECTION}
        page={Route.COLLECTIONS}
        searchParams={{ id: collectionPreview.alias.toString() }}>
        {collectionPreview.thumbnail ? (
          <img src={collectionPreview.thumbnail} alt={collectionPreview.name} />
        ) : (
          <div className={styles.icon}>
            <Icon name={IconName.COLLECTION} />
          </div>
        )}
      </LinkToPage>
    </div>
  )
}
