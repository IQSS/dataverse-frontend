import { Card, Icon, IconName, Stack } from '@iqss/dataverse-design-system'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import cn from 'classnames'
import { DvObjectFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import styles from './DvObjectFeaturedItemCard.module.scss'

interface DvObjectFeaturedItemCardProps {
  featuredItem: DvObjectFeaturedItem
}

export const DvObjectFeaturedItemCard = ({ featuredItem }: DvObjectFeaturedItemCardProps) => {
  const getDisplayValue = (type: DvObjectFeaturedItem['type']) => {
    switch (type) {
      case 'collection':
        return 'Collection'
      case 'dataset':
        return 'Dataset'
      case 'file':
        return 'File'
      default:
        return ''
    }
  }

  return (
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

        <footer className={styles.footer}>
          <a
            href={featuredItem.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm">
            <Stack direction="horizontal" gap={2}>
              <span className={styles.cta_link_text}>See {getDisplayValue(featuredItem.type)}</span>
              <BoxArrowUpRight size={14} />
            </Stack>
          </a>
        </footer>
      </Card.Body>
    </Card>
  )
}
