import DOMPurify from 'dompurify'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import styles from './FeaturedItems.module.scss'

interface FeaturedItemProps {
  featuredItem: CollectionFeaturedItem
}

export const FeaturedItem = ({ featuredItem }: FeaturedItemProps) => {
  const sanitizedContent = DOMPurify.sanitize(featuredItem.content, {
    USE_PROFILES: { html: true }
  })

  return (
    <div className={styles['featured-item-card']}>
      <div className={styles['inner-content']}>
        {featuredItem.imageUrl && (
          <img src={featuredItem.imageUrl} alt="" className={styles.image} />
        )}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </div>
  )
}
