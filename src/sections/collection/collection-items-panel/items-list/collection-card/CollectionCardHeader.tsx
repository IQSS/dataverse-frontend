import { Badge, Icon, IconName, Stack } from '@iqss/dataverse-design-system'
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
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <span>
          <LinkToPage
            type={DvObjectType.COLLECTION}
            page={Route.COLLECTIONS}
            searchParams={{ id: collectionPreview.alias.toString() }}>
            {collectionPreview.name}
          </LinkToPage>
          {collectionPreview.affiliation && (
            <span className={styles.affiliation}>({collectionPreview.affiliation})</span>
          )}
        </span>

        <Stack direction="horizontal" gap={1} className="flex-wrap">
          {!collectionPreview.isReleased && <Badge variant="warning">Unpublished</Badge>}

          {collectionPreview.userRoles && (
            <Stack direction="horizontal" gap={1} className="flex-wrap">
              {collectionPreview.userRoles.map((role, index) => (
                <Badge key={index} variant="info">
                  {role}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      <div className={styles['top-right-icon']}>
        <Icon name={IconName.COLLECTION} />
      </div>
    </header>
  )
}
