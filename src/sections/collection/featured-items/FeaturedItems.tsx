import { Card, Carousel } from 'react-bootstrap'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { MarkdownComponent } from '@/sections/dataset/markdown/MarkdownComponent'
import styles from './FeaturedItems.module.scss'

interface FeaturedItemsProps {
  featuredItems: CollectionFeaturedItem[]
  collectionDescription?: string
}

const FeaturedItems = ({ featuredItems, collectionDescription }: FeaturedItemsProps) => {
  return (
    <Carousel
      fade
      slide
      controls
      indicators
      interval={null}
      className={styles['featured-items-carousel']}
      prevIcon={<ChevronLeft color="black" size={40} />}
      nextIcon={<ChevronRight color="black" size={40} />}>
      {/* First item should be the description */}
      {/* Description can't be inside the cover, this one has a limited height */}
      {collectionDescription && (
        <Carousel.Item>
          <Card className={styles['featured-item-card']}>
            <Card.Body>
              <Card.Title as="h2">About</Card.Title>

              <MarkdownComponent markdown={collectionDescription} />
            </Card.Body>
          </Card>
        </Carousel.Item>
      )}

      {featuredItems.map((featuredItem, index) => (
        <Carousel.Item key={index}>
          <Card className={styles['featured-item-card']}>
            <Card.Body>
              <Card.Title as="h2" style={{ position: 'sticky', top: 0, background: '#fff' }}>
                {featuredItem.title}
              </Card.Title>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {featuredItem.image && (
                  <img
                    src={featuredItem.image.url}
                    alt={featuredItem.image.altText}
                    style={{ maxWidth: '50%', maxHeight: 250 }}
                  />
                )}
                <p style={{ flex: 1 }}>{featuredItem.content}</p>
              </div>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default FeaturedItems
