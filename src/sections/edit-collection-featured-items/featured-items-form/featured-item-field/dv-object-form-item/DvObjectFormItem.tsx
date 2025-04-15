import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { DvObjectTypeSelect } from './DvObjectTypeSelect'
import DvObjectIdSelect from './DvObjectIdSelect'
// import { DvObjectDescription } from './DvObjectDescription'

export const valueToLabel = (valueOpt: FeaturedItemType): string =>
  dvObjectTypesValueLabels.find(({ value }) => value === valueOpt)?.label ?? ''

export const labelToValue = (labelOpt: string): string =>
  dvObjectTypesValueLabels.find(({ label }) => label === labelOpt)?.value ?? ''

interface DvObjectFormItemProps {
  itemIndex: number
  featuredItemType: FeaturedItemType | ''
}

export const DvObjectFormItem = ({ itemIndex, featuredItemType }: DvObjectFormItemProps) => {
  return (
    <div>
      {/* Select to change dv object type, should update form. */}
      <DvObjectTypeSelect itemIndex={itemIndex} />

      {/* Select to search for choosen dv object */}
      {featuredItemType !== '' && (
        <DvObjectIdSelect
          itemIndex={itemIndex}
          featuredItemType={featuredItemType}
          key={featuredItemType}
        />
      )}

      {/* Textarea to add a description. */}
      {/* <DvObjectDescription itemIndex={itemIndex} /> */}
    </div>
  )
}

export const dvObjectTypesValueLabels = [
  {
    value: FeaturedItemType.COLLECTION,
    label: 'Collection'
  },
  {
    value: FeaturedItemType.DATASET,
    label: 'Dataset'
  },
  {
    value: FeaturedItemType.FILE,
    label: 'File'
  }
]
