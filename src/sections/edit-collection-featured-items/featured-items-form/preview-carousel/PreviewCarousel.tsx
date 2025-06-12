import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import {
  CustomFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemView } from '@/sections/featured-item/featured-item-view/FeaturedItemView'
import { FeaturedItemsFormHelper } from '../FeaturedItemsFormHelper'
import { CustomFeaturedItemField, FeaturedItemField } from '../../types'
import { Slider } from './slider/Slider'
import styles from './PreviewCarousel.module.scss'

export const PreviewCarousel = () => {
  const { t } = useTranslation('editCollectionFeaturedItems')
  const { t: tCollection } = useTranslation('collection')
  const featuredItemFieldValues = useWatch({ name: 'featuredItems' }) as FeaturedItemField[]

  const customFeaturedItems: CustomFeaturedItemField[] = featuredItemFieldValues.filter(
    (featuredItem) => featuredItem.type === FeaturedItemType.CUSTOM
  )

  const featuredItems: CustomFeaturedItem[] =
    FeaturedItemsFormHelper.transformCustomFormFieldsToFeaturedItems(customFeaturedItems)

  return (
    <Accordion className={styles['preview-carousel-accordion']}>
      <Accordion.Item eventKey="0" className={styles['accordion-item']}>
        <Accordion.Header>{t('previewCarouselHeader')}</Accordion.Header>
        <Accordion.Body className={styles['accordion-body']}>
          <Slider
            prevLabel={tCollection('featuredItems.slider.prevLabel')}
            nextLabel={tCollection('featuredItems.slider.nextLabel')}
            dotLabel={tCollection('featuredItems.slider.dotLabel')}
            dataTestId="featured-items-slider"
            items={featuredItems.map((featuredItem) => (
              <FeaturedItemView key={featuredItem.id} featuredItem={featuredItem} />
            ))}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
