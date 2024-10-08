import { Badge } from '@iqss/dataverse-design-system'
import coverExampleImage from '@/assets/cover-example.jpg'
import coverExampleImageDark from '@/assets/dark-cover-example.jpg'
import coverExampleImageLight from '@/assets/light-cover-example.jpg'
import { Collection } from '@/collection/domain/models/Collection'
import { DatasetLabelSemanticMeaning } from '@/dataset/domain/models/Dataset'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import styles from './CollectionInfo2.module.scss'

interface CollectionInfo2Props {
  collection: Collection
}

export const CollectionInfo2 = ({ collection }: CollectionInfo2Props) => {
  return (
    <div className={styles['collection-info']}>
      <div className={styles['top-section']}>
        <img src={coverExampleImage} className={styles['cover-image']} alt="cover-image" />
        {/* <img src={coverExampleImageDark} className={styles['cover-image']} alt="cover-image" /> */}
        {/* <img src={coverExampleImageLight} className={styles['cover-image']} alt="cover-image" /> */}

        <div className={styles.content}>
          <div className={styles['breadcrumbs-wrapper']}>
            <BreadcrumbsGenerator hierarchy={collection.hierarchy} />
          </div>

          <header className={styles.header}>
            <h1>{collection.name}</h1>
            <div className={styles.infoContainer}>
              {collection.affiliation && (
                <p className={styles.subtext}>({collection.affiliation})</p>
              )}
              {!collection.isReleased && (
                <div>
                  <Badge variant={DatasetLabelSemanticMeaning.WARNING}>Unpublished</Badge>
                </div>
              )}
            </div>
          </header>
        </div>
      </div>
    </div>
  )
}
