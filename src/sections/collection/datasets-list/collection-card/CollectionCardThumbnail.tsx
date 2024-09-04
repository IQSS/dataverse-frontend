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
    <div className={styles.thumbnail}>
      <LinkToPage
        type={DvObjectType.COLLECTION}
        page={Route.COLLECTIONS}
        searchParams={{ id: collectionPreview.id.toString() }}>
        {collectionPreview.thumbnail ? (
          <img
            className={styles['preview-image']}
            src={collectionPreview.thumbnail}
            alt={collectionPreview.name}
          />
        ) : (
          <div className={styles.icon}>
            <Icon name={IconName.COLLECTION} />
          </div>
        )}
      </LinkToPage>
    </div>
  )
}
