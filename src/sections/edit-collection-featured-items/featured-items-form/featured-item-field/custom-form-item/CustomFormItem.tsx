import { ContentField } from './ContentField'
import { ImageField } from './ImageField'

interface CustomFormItemProps {
  itemIndex: number
  editEnabled: boolean
  initialImageUrl?: string
}

export const CustomFormItem = ({
  itemIndex,
  editEnabled,
  initialImageUrl
}: CustomFormItemProps) => {
  return (
    <div data-testid={`custom-form-item-${itemIndex}`}>
      {/* CONTENT FIELD */}
      <ContentField itemIndex={itemIndex} editEnabled={editEnabled} />
      {/* IMAGE FIELD */}
      <ImageField
        itemIndex={itemIndex}
        editEnabled={editEnabled}
        initialImageUrl={initialImageUrl}
      />
    </div>
  )
}
