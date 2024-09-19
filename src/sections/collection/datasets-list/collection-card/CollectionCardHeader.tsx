import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { CollectionPreview } from '../../../../collection/domain/models/CollectionPreview'
import styles from './CollectionCard.module.scss'
import { Badge, Icon, IconName } from '@iqss/dataverse-design-system'
import { DvObjectType } from '../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface CollectionCardHeaderProps {
  collectionPreview: CollectionPreview
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
