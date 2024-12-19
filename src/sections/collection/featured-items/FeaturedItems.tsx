import { Card } from 'react-bootstrap'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { Slider } from './silder/Slider'
import styles from './FeaturedItems.module.scss'

interface FeaturedItemsProps {
  featuredItems: CollectionFeaturedItem[]
}

// TODO:ME - Sanitize the content before rendering it, check that nothing is missing, when sending to the backend sanitize also and be careful with ul as in lio.

export const FeaturedItems = ({ featuredItems }: FeaturedItemsProps) => {
  return (
    <Slider
      prevLabel="Go to previous slide"
      nextLabel="Go to next slide"
      dotLabel="Go to slide"
      className={styles['featured-items-slider']}
      items={featuredItems.map((featuredItem, index) => (
        <Card className={styles['featured-item-card']} key={index}>
          <Card.Body>
            <Card.Title as="h2" style={{ position: 'sticky', top: 0 }}>
              {featuredItem.title}
            </Card.Title>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              {featuredItem.imageUrl && (
                <img
                  src={featuredItem.imageUrl}
                  alt={featuredItem.title}
                  style={{ maxWidth: '40%' }}
                />
              )}
              <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: featuredItem.content }} />
            </div>
          </Card.Body>
        </Card>
      ))}
    />
  )
}
