import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import styles from './FeaturedItems.module.scss'

interface FeaturedItemProps {
  featuredItem: CollectionFeaturedItem
}

export const FeaturedItem = ({ featuredItem }: FeaturedItemProps) => {
  const imageUrl = useMemo(() => {
    if (!featuredItem.imageFileUrl) return null

    return featuredItem.imageFileUrl.startsWith('blob:')
      ? featuredItem.imageFileUrl
      : appendTimestampToImageUrl(featuredItem.imageFileUrl)
  }, [featuredItem.imageFileUrl])

  const sanitizedContent = DOMPurify.sanitize(featuredItem.content, {
    USE_PROFILES: { html: true }
  })

  return (
    <div className={styles['featured-item-card']}>
      <div className={styles['inner-content']}>
        {imageUrl && <img src={imageUrl} alt="" className={styles.image} />}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </div>
  )
}

/*
  NOTE:
  To avoid image caching issues, for example after just changing the image of an existing featured item (image url will keep the same) we add a
  timestamp as query param to the image URL so we force the browser to fetch the image again.
  When this component is used in the edit collection featured items form previewer, the imageFileUrl is a local generated blob URL, in that case
  we don't need to add the timestamp.
*/
export const appendTimestampToImageUrl = (imageUrl: string) =>
  `${imageUrl}?timestamp-to-invalidate-cache=${Date.now()}`
