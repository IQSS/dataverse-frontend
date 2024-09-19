import { CollectionCardHeader } from './CollectionCardHeader'
import { CollectionCardThumbnail } from './CollectionCardThumbnail'
import { CollectionCardInfo } from './CollectionCardInfo'
import { CollectionPreview } from '../../../../collection/domain/models/CollectionPreview'
import styles from './CollectionCard.module.scss'

interface CollectionCardProps {
  collectionPreview: CollectionPreview
}

export function CollectionCard({ collectionPreview }: CollectionCardProps) {
  return (
    <article className={styles['card-main-container']}>
      <CollectionCardHeader collectionPreview={collectionPreview} />
      <div className={styles['thumbnail-and-info-wrapper']}>
        <CollectionCardThumbnail collectionPreview={collectionPreview} />
        <CollectionCardInfo collectionPreview={collectionPreview} />
      </div>
    </article>
  )
}
