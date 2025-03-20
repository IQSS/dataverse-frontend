import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import { Card, Stack } from '@iqss/dataverse-design-system'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
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
    <Card className={styles.custom_featured_item_card}>
      {imageUrl && <Card.Image src={imageUrl} alt="" variant="top" className={styles.image} />}
      <Card.Body className={styles.body}>
        <div
          className={cn(styles.content, {
            [styles.with_image]: imageUrl
          })}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        <footer className={styles.footer}>
          <Link
            to={RouteWithParams.FEATURED_ITEM(collectionId, featuredItem.id.toString())}
            className="btn btn-secondary btn-sm">
            <Stack direction="horizontal" gap={2}>
              <span className={styles.cta_link_text}>See Featured Item</span>
              <BoxArrowUpRight size={14} />
            </Stack>
          </Link>
        </footer>
      </Card.Body>
    </Card>
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
