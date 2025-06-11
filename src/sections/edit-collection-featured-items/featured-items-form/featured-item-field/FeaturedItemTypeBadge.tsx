import { Badge } from '@iqss/dataverse-design-system'
import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'

interface FeaturedItemTypeBadgeProps {
  type: FeaturedItemType
}

export const FeaturedItemTypeBadge = ({ type }: FeaturedItemTypeBadgeProps) => {
  // TODO:ME - Add i18n support for the badge text
  const typeToDisplayMap = {
    [FeaturedItemType.CUSTOM]: 'Custom',
    [FeaturedItemType.COLLECTION]: 'Featured Collection',
    [FeaturedItemType.DATASET]: 'Featured Dataset',
    [FeaturedItemType.FILE]: 'Featured File'
  }

  return <Badge variant="primary">{typeToDisplayMap[type]}</Badge>
}
