import { Accordion } from '@iqss/dataverse-design-system'
import FeaturedItems from '@/sections/collection/featured-items/FeaturedItems'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

interface PreviewCarouselProps {
  currentFormFeaturedItems: CollectionFeaturedItem[]
}

export const PreviewCarousel = ({ currentFormFeaturedItems }: PreviewCarouselProps) => {
  console.log({ currentFormFeaturedItems })
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Preview of the carousel of featured items</Accordion.Header>
        <Accordion.Body>
          <FeaturedItems featuredItems={currentFormFeaturedItems} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
