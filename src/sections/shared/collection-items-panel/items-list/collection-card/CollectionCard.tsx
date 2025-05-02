import { CollectionCardHeader } from './CollectionCardHeader'
import { CollectionCardThumbnail } from './CollectionCardThumbnail'
import { CollectionCardInfo } from './CollectionCardInfo'
import { CollectionItemTypePreview } from '@/collection/domain/models/CollectionItemTypePreview'
import styles from './CollectionCard.module.scss'

interface CollectionCardProps {
  collectionPreview: CollectionItemTypePreview
  parentCollectionAlias: string
}

export function CollectionCard({ collectionPreview, parentCollectionAlias }: CollectionCardProps) {
  return (
    <article className={styles['card-main-container']} data-testid="collection-card">
      <CollectionCardHeader collectionPreview={collectionPreview} />
      <div className={styles['thumbnail-and-info-wrapper']}>
        <CollectionCardThumbnail collectionPreview={collectionPreview} />
        <CollectionCardInfo
          parentCollectionAlias={parentCollectionAlias}
          collectionPreview={collectionPreview}
        />
      </div>
    </article>
  )
}
