import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { CustomFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { Collection } from '@/collection/domain/models/Collection'
import styles from './FeaturedItemView.module.scss'

type FeaturedItemViewProps =
  | {
      featuredItem: CustomFeaturedItem
      showBreadcrumbs?: false
      collectionHierarchy?: never
    }
  | {
      featuredItem: CustomFeaturedItem
      showBreadcrumbs: true
      collectionHierarchy: Collection['hierarchy']
    }

export const FeaturedItemView = ({
  featuredItem,
  showBreadcrumbs,
  collectionHierarchy
}: FeaturedItemViewProps) => {
  const showTopBreadcrumb = showBreadcrumbs && !featuredItem.imageFileUrl

  const imageUrl = useMemo(() => {
    if (!featuredItem.imageFileUrl) return null

    return featuredItem.imageFileUrl.startsWith('blob:')
      ? featuredItem.imageFileUrl
      : appendTimestampToImageUrl(featuredItem.imageFileUrl)
  }, [featuredItem.imageFileUrl])

  const showBanner = imageUrl

  const sanitizedContent = DOMPurify.sanitize(featuredItem.content, {
    USE_PROFILES: { html: true }
  })

  return (
    <section className={styles.featured_item_view}>
      {showTopBreadcrumb && (
        <BreadcrumbsGenerator
          hierarchy={collectionHierarchy}
          withActionItem
          actionItemText={'Featured Item'}
        />
      )}

      {showBanner && (
        <div className={styles.img_banner}>
          <img src={imageUrl} alt="featured item image" />

          {showBreadcrumbs && (
            <div className={styles.breadcrumbs_in_banner_wrapper}>
              <BreadcrumbsGenerator
                hierarchy={collectionHierarchy}
                withActionItem
                actionItemText={'Featured Item'}
              />
            </div>
          )}
        </div>
      )}

      <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </section>
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
