import styles from './CollectionCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { Icon, IconName } from '@iqss/dataverse-design-system'
import { CollectionPreview } from '../../../../collection/domain/models/CollectionPreview'
import { DvObjectType } from '../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface CollectionCardCardThumbnailProps {
  collectionPreview: CollectionPreview
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
