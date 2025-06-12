import { Card, Icon, IconName } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import {
  DvObjectFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import styles from './DvObjectFeaturedItemCard.module.scss'
import { Link } from 'react-router-dom'

interface DvObjectFeaturedItemCardProps {
  featuredItem: DvObjectFeaturedItem
}

export const DvObjectFeaturedItemCard = ({ featuredItem }: DvObjectFeaturedItemCardProps) => {
  // TODO:ME - Extend dv objects to have the title of collection, dataset, or name of file.

  const createDvObjectURL = (type: DvObjectFeaturedItem['type'], identifier: string): string => {
    switch (type) {
      case FeaturedItemType.COLLECTION:
        return `${Route.COLLECTIONS_BASE}/${identifier}`
      case FeaturedItemType.DATASET:
        return `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${identifier}`
      case FeaturedItemType.FILE:
        return `${Route.FILES}?${QueryParamKey.FILE_ID}=${identifier}`
      default:
        return '#' // Fallback URL if type is unknown
    }
  }

  const dvObjectURL = createDvObjectURL(featuredItem.type, featuredItem.dvObjectIdentifier)

  return (
    <Link to={dvObjectURL} aria-label={`View ${featuredItem.type}`} className={styles.link_wrapper}>
      <Card className={styles.custom_featured_item_card}>
        <Card.Body className={styles.body}>
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
          <h4 className={styles.title}>{featuredItem.dvObjectDisplayName}</h4>
        </Card.Body>
      </Card>
    </Link>
  )
}
