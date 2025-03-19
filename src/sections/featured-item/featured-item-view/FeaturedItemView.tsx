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
  const showBanner = featuredItem.imageFileUrl

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
          <img src={featuredItem.imageFileUrl} alt="featured item image" />

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
