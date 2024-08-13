import styles from './CollectionCard.module.scss'
import { DateHelper } from '../../../../shared/helpers/DateHelper'
import { Stack } from '@iqss/dataverse-design-system'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { CollectionPreview } from '../../../../collection/domain/models/CollectionPreview'

interface CollectionCardInfoProps {
  collectionPreview: CollectionPreview
}

export function CollectionCardInfo({ collectionPreview }: CollectionCardInfoProps) {
  return (
    <div className={styles['card-info-container']}>
      <Stack gap={1}>
        <Stack direction="horizontal" gap={2}>
          <span className={styles.date}>
            {DateHelper.toDisplayFormat(collectionPreview.releaseOrCreateDate)}
          </span>
          {collectionPreview.parentCollectionName && collectionPreview.parentCollectionId && (
            <LinkToPage
              page={Route.COLLECTIONS}
              searchParams={{ id: collectionPreview.parentCollectionId.toString() }}>
              {collectionPreview.parentCollectionName}
            </LinkToPage>
          )}
        </Stack>

        <p className={styles.description}>{collectionPreview.description}</p>
      </Stack>
    </div>
  )
}
