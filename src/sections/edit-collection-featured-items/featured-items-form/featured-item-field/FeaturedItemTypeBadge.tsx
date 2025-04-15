import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { Badge } from '@iqss/dataverse-design-system'

interface FeaturedItemTypeBadgeProps {
  type: FeaturedItemType
}

export const FeaturedItemTypeBadge = ({ type }: FeaturedItemTypeBadgeProps) => {
  const typeToDisplayMap = {
    [FeaturedItemType.CUSTOM]: 'Custom',
    [FeaturedItemType.COLLECTION]: 'Featured Collection',
    [FeaturedItemType.DATASET]: 'Featured Dataset',
    [FeaturedItemType.FILE]: 'Featured File'
  }

  return <Badge variant="primary">{typeToDisplayMap[type]}</Badge>
}
