import { useWatch } from 'react-hook-form'
import { Accordion } from '@iqss/dataverse-design-system'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItems } from '@/sections/collection/featured-items/FeaturedItems'
import { FeaturedItemField } from '../types'

export const PreviewCarousel = () => {
  const featuredItemsFieldValue = useWatch({ name: 'featuredItems' }) as FeaturedItemField[]

  const formFieldsToFeaturedItems: CollectionFeaturedItem[] = featuredItemsFieldValue.map(
    (field, index) => {
      const { title, content, image, itemId } = field

      const currentFeaturedItem: CollectionFeaturedItem = {
        id: itemId ?? window.crypto.randomUUID(),
        type: 'custom',
        order: index,
        title,
        content
      }

      if (image && image instanceof File) {
        const objectUrl = URL.createObjectURL(image)

        currentFeaturedItem.imageUrl = objectUrl
      }

      if (image && typeof image === 'string') {
        currentFeaturedItem.imageUrl = image
      }

      return currentFeaturedItem
    }
  )
  return (
    <Accordion>
      <Accordion.Item eventKey="0" style={{ overflow: 'hidden' }}>
        <Accordion.Header>Preview of the featured items carousel</Accordion.Header>
        <Accordion.Body style={{ padding: 0 }}>
          <FeaturedItems featuredItems={formFieldsToFeaturedItems} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
