import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import { Card } from '@iqss/dataverse-design-system'
import { CustomFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { RouteWithParams } from '@/sections/Route.enum'
import styles from './CustomFeaturedItemCard.module.scss'

interface CustomFeaturedItemCardProps {
  featuredItem: CustomFeaturedItem
  collectionId: string
}

export const CustomFeaturedItemCard = ({
  featuredItem,
  collectionId
}: CustomFeaturedItemCardProps) => {
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
    <Link
      to={RouteWithParams.FEATURED_ITEM(collectionId, featuredItem.id.toString())}
      aria-label="View featured item"
      className={styles.link_wrapper}>
      <Card className={styles.custom_featured_item_card}>
        {imageUrl && <Card.Image src={imageUrl} alt="" variant="top" className={styles.image} />}
        <Card.Body>
          <div
            className={cn(styles.content, {
              [styles.with_image]: imageUrl
            })}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            inert=""
            tabIndex={-1}
          />
        </Card.Body>
      </Card>
    </Link>
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
