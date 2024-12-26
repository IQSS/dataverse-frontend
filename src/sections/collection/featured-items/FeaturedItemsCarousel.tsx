import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import { FeaturedItems, FeaturedItemsProps } from './FeaturedItems'

type FeaturedItemsCarouselProps = FeaturedItemsProps

export const FeaturedItemsCarousel = ({ featuredItems }: FeaturedItemsCarouselProps) => {
  const { t } = useTranslation('collection')

  return (
    <Accordion>
      <Accordion.Item eventKey="0" style={{ overflow: 'hidden' }}>
        <Accordion.Header>{t('featuredItems.title')}</Accordion.Header>
        <Accordion.Body style={{ padding: 0 }}>
          <FeaturedItems featuredItems={featuredItems} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
