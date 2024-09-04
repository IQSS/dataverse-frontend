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
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <LinkToPage
            type={DvObjectType.COLLECTION}
            page={Route.COLLECTIONS}
            searchParams={{ id: collectionPreview.id.toString() }}>
            {collectionPreview.name}
          </LinkToPage>
          {collectionPreview.affiliation && (
            <span className={styles.affiliation}> ({collectionPreview.affiliation})</span>
          )}
          {!collectionPreview.isReleased && (
            <div className={styles.badge}>
              <Badge variant="warning">Unpublished</Badge>
            </div>
          )}
        </div>

        <div className={styles.icon}>
          <Icon name={IconName.COLLECTION} />
        </div>
      </div>
    </>
  )
}
