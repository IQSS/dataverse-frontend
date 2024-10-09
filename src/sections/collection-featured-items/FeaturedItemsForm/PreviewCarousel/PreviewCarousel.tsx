import FeaturedItems from '@/sections/collection/featured-items/FeaturedItems'
import { Accordion } from '@iqss/dataverse-design-system'

export const PreviewCarousel = () => {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Preview Featured Items Carousel</Accordion.Header>
        <Accordion.Body>
          <FeaturedItems />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
