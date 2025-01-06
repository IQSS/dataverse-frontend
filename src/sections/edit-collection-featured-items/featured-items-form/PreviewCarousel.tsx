import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { Slider } from '@/sections/collection/featured-items/slider/Slider'
import { FeaturedItem } from '@/sections/collection/featured-items/FeaturedItem'
import { FeaturedItemsFormHelper } from './FeaturedItemsFormHelper'
import { FeaturedItemField } from '../types'

export const PreviewCarousel = () => {
  const { t } = useTranslation('editCollectionFeaturedItems')
  const { t: tCollection } = useTranslation('collection')
  const featureItemFieldValues = useWatch({ name: 'featuredItems' }) as FeaturedItemField[]

  const formFieldsToFeaturedItems: CollectionFeaturedItem[] =
    FeaturedItemsFormHelper.transformFormFieldsToFeaturedItems(featureItemFieldValues)

  return (
    <Accordion>
      <Accordion.Item eventKey="0" style={{ overflow: 'hidden' }}>
        <Accordion.Header>{t('previewCarouselHeader')}</Accordion.Header>
        <Accordion.Body style={{ padding: 0, paddingTop: '2rem' }}>
          <Slider
            prevLabel={tCollection('featuredItems.slider.prevLabel')}
            nextLabel={tCollection('featuredItems.slider.nextLabel')}
            dotLabel={tCollection('featuredItems.slider.dotLabel')}
            dataTestId="featured-items-slider"
            items={formFieldsToFeaturedItems.map((featuredItem) => (
              <FeaturedItem featuredItem={featuredItem} key={featuredItem.id} />
            ))}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
