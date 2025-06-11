import { useMemo } from 'react'
import { Card, Icon, IconName } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import {
  DvObjectFeaturedItem,
  DvObjectFeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import styles from './DvObjectFeaturedItemCard.module.scss'

interface DvObjectFeaturedItemCardProps {
  featuredItem: DvObjectFeaturedItem
}

export const DvObjectFeaturedItemCard = ({ featuredItem }: DvObjectFeaturedItemCardProps) => {
  // TODO:ME - Extend dv objects to have the title of collection, dataset, or name of file.

  const createDvObjectURL = (type: DvObjectFeaturedItem['type'], identifier: string): string => {
    switch (type) {
      case DvObjectFeaturedItemType.COLLECTION:
        return `${Route.COLLECTIONS_BASE}/${identifier}`
      case DvObjectFeaturedItemType.DATASET:
        return `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${identifier}`
      case DvObjectFeaturedItemType.FILE:
        return `${Route.FILES}?${QueryParamKey.FILE_ID}=${identifier}`
      default:
        return '#' // Fallback URL if type is unknown
    }
  }

  // TODO:ME - Do we want target blank links or in same tab links? <a /> or <Link />?
  const dvObjectURL = useMemo(() => {
    return createDvObjectURL(featuredItem.type, featuredItem.dvObjectIdentifier)
  }, [featuredItem.type, featuredItem.dvObjectIdentifier])

  return (
    <a
      href={dvObjectURL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${featuredItem.type}`}
      className={styles.link_wrapper}>
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
          {featuredItem.type === DvObjectFeaturedItemType.COLLECTION && (
            <h4 className={styles.title}>Collection That Contains Information</h4>
          )}
          {featuredItem.type === DvObjectFeaturedItemType.DATASET && (
            <h4 className={styles.title}>
              Evaluation of Intradural Stimulation Efficiency and Selectivity in a Computational
              Model of Spinal Cord Stimulation
            </h4>
          )}
          {featuredItem.type === DvObjectFeaturedItemType.FILE && (
            <h4 className={styles.title}>Screenshot 2023-09-07 at 12.32.23.png</h4>
          )}
        </Card.Body>
      </Card>
    </a>
  )
}
