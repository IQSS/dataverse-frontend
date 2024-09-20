import { Badge, Icon, IconName } from '@iqss/dataverse-design-system'
import { Route } from '../../../../Route.enum'
import { CollectionItemTypePreview } from '../../../../../collection/domain/models/CollectionItemTypePreview'
import { DvObjectType } from '../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { LinkToPage } from '../../../../shared/link-to-page/LinkToPage'
import styles from './CollectionCard.module.scss'

interface CollectionCardHeaderProps {
  collectionPreview: CollectionItemTypePreview
}

export function CollectionCardHeader({ collectionPreview }: CollectionCardHeaderProps) {
  return (
    <div className={styles['card-header-container']}>
      <div className={styles.title}>
        <LinkToPage
          type={DvObjectType.COLLECTION}
          page={Route.COLLECTIONS}
          searchParams={{ id: collectionPreview.alias.toString() }}>
          {collectionPreview.name}
        </LinkToPage>
        {collectionPreview.affiliation && (
          <p className={styles.affiliation}>({collectionPreview.affiliation})</p>
        )}
        {!collectionPreview.isReleased && (
          <div>
            <Badge variant="warning">Unpublished</Badge>
          </div>
        )}
      </div>

      <div className={styles['top-right-icon']}>
        <Icon name={IconName.COLLECTION} />
      </div>
    </div>
  )
}
