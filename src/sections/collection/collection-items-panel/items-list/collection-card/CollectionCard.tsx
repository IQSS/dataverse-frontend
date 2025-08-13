import { CollectionCardHeader } from './CollectionCardHeader'
import { CollectionItemTypePreview } from '@/collection/domain/models/CollectionItemTypePreview'
import { CollectionCardBody } from './CollectionCardBody'
import styles from './CollectionCard.module.scss'

interface CollectionCardProps {
  collectionPreview: CollectionItemTypePreview
  parentCollectionAlias?: string
}

export function CollectionCard({ collectionPreview, parentCollectionAlias }: CollectionCardProps) {
  return (
    <article className={styles['card-main-container']} data-testid="collection-card">
      <CollectionCardHeader collectionPreview={collectionPreview} />
      <CollectionCardBody
        collectionPreview={collectionPreview}
        parentCollectionAlias={parentCollectionAlias}
      />
    </article>
  )
}
