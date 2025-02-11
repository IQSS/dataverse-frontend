import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { Col, Row } from '@iqss/dataverse-design-system'
import { DynamicFieldsButtons } from '@/sections/shared/form/DynamicFieldsButtons/DynamicFieldsButtons'
import { ImageField } from './ImageField'
import styles from './FeaturedItemField.module.scss'
import ContentField from './ContentField'

interface FeaturedItemFieldProps {
  id: string
  itemIndex: number
  onAddField: (index: number) => void
  onRemoveField: (index: number) => void
  disableDragWhenOnlyOneItem: boolean
  initialImageUrl?: string
}

export const FeaturedItemField = ({
  id,
  itemIndex,
  onAddField,
  onRemoveField,
  disableDragWhenOnlyOneItem,
  initialImageUrl
}: FeaturedItemFieldProps) => {
  const { t: tShared } = useTranslation('shared')

  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    setActivatorNodeRef,
    isSorting,
    active
  } = useSortable({ id })

  const attributesCheckingDisabled = disableDragWhenOnlyOneItem
    ? { ...attributes, ['aria-disabled']: true, tabIndex: -1 }
    : attributes

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <div
      id={id}
      data-featured-item={`featured-item-${itemIndex}`}
      ref={setNodeRef}
      style={style}
      data-testid={`featured-item-${itemIndex.toString()}`}
      className={cn(styles['featured-item-fields-wrapper'], {
        [styles['sorting']]: isSorting,
        [styles['active']]: active?.id === id
      })}>
      <Row>
        <Col md={1}>
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributesCheckingDisabled}
            {...listeners}
            className={cn(styles['drag-handle'], {
              [styles['disabled']]: disableDragWhenOnlyOneItem
            })}
            aria-label={tShared('dragHandleLabel')}
            disabled={disableDragWhenOnlyOneItem}>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="6" r="1.5" fill="#777" />
              <circle cx="15" cy="6" r="1.5" fill="#777" />
              <circle cx="9" cy="12" r="1.5" fill="#777" />
              <circle cx="15" cy="12" r="1.5" fill="#777" />
              <circle cx="9" cy="18" r="1.5" fill="#777" />
              <circle cx="15" cy="18" r="1.5" fill="#777" />
            </svg>
          </button>
        </Col>
        <Col md={8} lg={9}>
          {/* CONTENT FIELD */}
          <ContentField itemIndex={itemIndex} />
          {/* IMAGE FIELD */}
          <ImageField itemIndex={itemIndex} initialImageUrl={initialImageUrl} />
        </Col>
        <Col md={3} lg={2} style={{ marginTop: '2rem' }}>
          <DynamicFieldsButtons
            fieldName="Featured Item"
            onAddButtonClick={() => onAddField(itemIndex)}
            onRemoveButtonClick={() => onRemoveField(itemIndex)}
            originalField={itemIndex === 0}
          />
        </Col>
      </Row>
      <span className={styles['order-value']}>Order {itemIndex + 1}</span>
    </div>
  )
}
