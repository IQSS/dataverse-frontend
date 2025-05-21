import { Badge, Icon, IconName } from '@iqss/dataverse-design-system'
import { Route } from '@/sections/Route.enum'
import { CollectionItemTypePreview } from '@/collection/domain/models/CollectionItemTypePreview'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import styles from './CollectionCard.module.scss'

interface CollectionCardHeaderProps {
  collectionPreview: CollectionItemTypePreview
}

export function CollectionCardHeader({ collectionPreview }: CollectionCardHeaderProps) {
  return (
    <header className={styles['card-header-container']}>
      <div className={styles['left-side-content']}>
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
        {collectionPreview.userRoles &&
          collectionPreview.userRoles.map((role, index) => (
            <Badge key={index} variant="success">
              {role}
            </Badge>
          ))}
      </div>

      <div className={styles['top-right-icon']}>
        <Icon name={IconName.COLLECTION} />
      </div>
    </header>
  )
}
