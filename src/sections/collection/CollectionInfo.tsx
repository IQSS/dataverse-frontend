import { Collection } from '../../collection/domain/models/Collection'
import styles from './Collection.module.scss'

interface CollectionInfoProps {
  collection: Collection
}

export function CollectionInfo({ collection }: CollectionInfoProps) {
  return (
    <>
      <header className={styles.header}>
        <h1>{collection.name}</h1>
        {collection.affiliation && (
          <span className={styles.subtext}>({collection.affiliation})</span>
        )}
      </header>
      {collection.description && (
        <div>
          <p>{collection.description}</p>
        </div>
      )}
    </>
  )
}
