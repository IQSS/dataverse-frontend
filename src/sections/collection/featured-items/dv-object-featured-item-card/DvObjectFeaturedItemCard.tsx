import { Card, Icon, IconName } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { DvObjectFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import styles from './DvObjectFeaturedItemCard.module.scss'

interface DvObjectFeaturedItemCardProps {
  featuredItem: DvObjectFeaturedItem
}

export const DvObjectFeaturedItemCard = ({ featuredItem }: DvObjectFeaturedItemCardProps) => {
  return (
    <a
      href={featuredItem.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${featuredItem.type as string}`}
      className={styles.link_wrapper}>
      <Card className={styles.custom_featured_item_card}>
        <Card.Body className={styles.body}>
          <h4>{featuredItem.title}</h4>
          <div className={styles.desc_img_wrapper}>
            <div
              className={cn(styles.icon, {
                [styles.collection]: featuredItem.type === 'collection',
                [styles.dataset]: featuredItem.type === 'dataset',
                [styles.file]: featuredItem.type === 'file'
              })}>
              {featuredItem.type === 'collection' && <Icon name={IconName.COLLECTION} />}
              {featuredItem.type === 'dataset' && <Icon name={IconName.DATASET} />}
              {featuredItem.type === 'file' && <Icon name={IconName.FILE} />}
            </div>
            <p className={styles.description}>{featuredItem.description}</p>
          </div>
        </Card.Body>
      </Card>
    </a>
  )
}
