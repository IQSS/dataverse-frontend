import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItems } from '@/sections/collection/featured-items/FeaturedItems'
import { FeaturedItemsFormHelper } from './FeaturedItemsFormHelper'
import { FeaturedItemField } from '../types'

export const PreviewCarousel = () => {
  const { t } = useTranslation('editCollectionFeaturedItems')
  const featureItemFieldValues = useWatch({ name: 'featuredItems' }) as FeaturedItemField[]

  const formFieldsToFeaturedItems: CollectionFeaturedItem[] =
    FeaturedItemsFormHelper.transformFormFieldsToFeaturedItems(featureItemFieldValues)

  return (
    <Accordion>
      <Accordion.Item eventKey="0" style={{ overflow: 'hidden' }}>
        <Accordion.Header>{t('previewCarouselHeader')}</Accordion.Header>
        <Accordion.Body style={{ padding: 0 }}>
          <FeaturedItems featuredItems={formFieldsToFeaturedItems} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
