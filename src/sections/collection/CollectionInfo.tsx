import { Collection } from '../../collection/domain/models/Collection'
import styles from './Collection.module.scss'
import { MarkdownComponent } from '../dataset/markdown/MarkdownComponent'
import { Badge } from '@iqss/dataverse-design-system'
import { DatasetLabelSemanticMeaning } from '../../dataset/domain/models/Dataset'

interface CollectionInfoProps {
  collection: Collection
}

export function CollectionInfo({ collection }: CollectionInfoProps) {
  return (
    <>
      <header className={styles.header}>
        <h1>{collection.name}</h1>
        <div className={styles.infoContainer}>
          {collection.affiliation && (
            <span className={styles.subtext}>({collection.affiliation})</span>
          )}
          {!collection.isReleased && (
            <div>
              <Badge variant={DatasetLabelSemanticMeaning.WARNING}>Unpublished</Badge>
            </div>
          )}
        </div>
      </header>
      {collection.description && (
        <div>
          <MarkdownComponent markdown={collection.description} />
        </div>
      )}
    </>
  )
}
