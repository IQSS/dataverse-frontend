import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemsFormHelper } from '../FeaturedItemsFormHelper'
import { FeaturedItemField } from '../../types'
import { Slider } from './slider/Slider'
import styles from './PreviewCarousel.module.scss'

export const PreviewCarousel = () => {
  const { t } = useTranslation('editCollectionFeaturedItems')
  const { t: tCollection } = useTranslation('collection')
  const featuredItemFieldValues = useWatch({ name: 'featuredItems' }) as FeaturedItemField[]

  const formFieldsToFeaturedItems: CollectionFeaturedItem[] =
    FeaturedItemsFormHelper.transformFormFieldsToFeaturedItems(featuredItemFieldValues)

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
            items={formFieldsToFeaturedItems.map((featuredItem) => (
              <div key={featuredItem.id}>
                Mock, here we need to use the Featured Item Page component or something similar.
                {/* <FeaturedItemCard featuredItem={featuredItem} key={featuredItem.id} /> */}
              </div>
            ))}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
