import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { Slider } from './silder/Slider'
import { FeaturedItem } from './FeaturedItem'
import styles from './FeaturedItems.module.scss'

interface FeaturedItemsProps {
  featuredItems: CollectionFeaturedItem[]
}

export const FeaturedItems = ({ featuredItems }: FeaturedItemsProps) => {
  return (
    <Slider
      prevLabel="Go to previous slide"
      nextLabel="Go to next slide"
      dotLabel="Go to slide"
      className={styles['featured-items-slider']}
      items={featuredItems.map((featuredItem) => (
        <FeaturedItem featuredItem={featuredItem} key={featuredItem.id} />
      ))}
    />
  )
}
