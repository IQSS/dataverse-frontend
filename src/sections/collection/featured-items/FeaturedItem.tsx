import { UIEvent, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import cn from 'classnames'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import styles from './FeaturedItems.module.scss'

interface FeaturedItemProps {
  featuredItem: CollectionFeaturedItem
}

export const FeaturedItem = ({ featuredItem }: FeaturedItemProps) => {
  const [cardScrolled, setCardScrolled] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const sanitizedContent = DOMPurify.sanitize(featuredItem.content, {
    USE_PROFILES: { html: true }
  })

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (cardRef.current) {
      const scrollTop = e.currentTarget.scrollTop

      setCardScrolled(scrollTop > 50)
    }
  }
  return (
    <div className={styles['featured-item-card']} onScroll={handleScroll} ref={cardRef}>
      <h2
        className={cn(styles.title, {
          [styles['card-scrolled']]: cardScrolled
        })}>
        {featuredItem.title}
      </h2>
      <div className={styles['inner-content']}>
        {featuredItem.imageUrl && (
          <img src={featuredItem.imageUrl} alt={featuredItem.title} className={styles.image} />
        )}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </div>
  )
}
