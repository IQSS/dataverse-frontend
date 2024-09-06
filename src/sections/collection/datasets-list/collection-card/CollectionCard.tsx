import { CollectionCardHeader } from './CollectionCardHeader'
import { CollectionCardThumbnail } from './CollectionCardThumbnail'
import { CollectionCardInfo } from './CollectionCardInfo'
import { Stack } from '@iqss/dataverse-design-system'
import { CollectionPreview } from '../../../../collection/domain/models/CollectionPreview'
import styles from './CollectionCard.module.scss'

interface CollectionCardProps {
  collectionPreview: CollectionPreview
}

export function CollectionCard({ collectionPreview }: CollectionCardProps) {
  return (
    <article className={styles.container}>
      <CollectionCardHeader collectionPreview={collectionPreview} />
      <div className={styles.info}>
        <Stack direction={'horizontal'} gap={3}>
          <CollectionCardThumbnail collectionPreview={collectionPreview} />
          <CollectionCardInfo collectionPreview={collectionPreview} />
        </Stack>
      </div>
    </article>
  )
}
