import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useGetCollectionFeaturedItems } from '../useGetCollectionFeaturedItems'
import { Slider } from './slider/Slider'
import { FeaturedItem } from './FeaturedItem'
import styles from './FeaturedItems.module.scss'

export interface FeaturedItemsProps {
  collectionRepository: CollectionRepository
  collectionId: string
}

export const FeaturedItems = ({ collectionRepository, collectionId }: FeaturedItemsProps) => {
  const { t } = useTranslation('collection')
  const { collectionFeaturedItems, isLoading: isLoadingCollectionFeaturedItems } =
    useGetCollectionFeaturedItems(collectionRepository, collectionId)

  const hasFeaturedItems = collectionFeaturedItems.length > 0

  if (isLoadingCollectionFeaturedItems || !hasFeaturedItems) {
    return null
  }

  return (
    <Accordion className={styles['featured-items-accordion']}>
      <Accordion.Item eventKey="0" style={{ overflow: 'hidden' }}>
        <Accordion.Header>{t('featuredItems.title')}</Accordion.Header>
        <Accordion.Body style={{ padding: 0, paddingTop: '2rem' }}>
          <Slider
            prevLabel={t('featuredItems.slider.prevLabel')}
            nextLabel={t('featuredItems.slider.nextLabel')}
            dotLabel={t('featuredItems.slider.dotLabel')}
            dataTestId="featured-items-slider"
            items={collectionFeaturedItems.map((featuredItem) => (
              <FeaturedItem featuredItem={featuredItem} key={featuredItem.id} />
            ))}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
