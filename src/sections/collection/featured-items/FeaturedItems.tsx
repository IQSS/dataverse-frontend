import { useTranslation } from 'react-i18next'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { Slider } from './slider/Slider'
import { FeaturedItem } from './FeaturedItem'
import styles from './FeaturedItems.module.scss'

export interface FeaturedItemsProps {
  featuredItems: CollectionFeaturedItem[]
}

export const FeaturedItems = ({ featuredItems }: FeaturedItemsProps) => {
  const { t } = useTranslation('collection')

  return (
    <Slider
      prevLabel={t('featuredItems.slider.prevLabel')}
      nextLabel={t('featuredItems.slider.nextLabel')}
      dotLabel={t('featuredItems.slider.dotLabel')}
      className={styles['featured-items-slider']}
      dataTestId="featured-items-slider"
      items={featuredItems.map((featuredItem) => (
        <FeaturedItem featuredItem={featuredItem} key={featuredItem.id} />
      ))}
    />
  )
}
