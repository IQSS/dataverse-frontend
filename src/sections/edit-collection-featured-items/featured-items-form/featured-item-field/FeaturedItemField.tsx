import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Pencil } from 'react-bootstrap-icons'
import cn from 'classnames'
import { Badge, Button, Col, Row, Tooltip } from '@iqss/dataverse-design-system'
import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { DynamicFieldsButtons } from '@/sections/shared/form/DynamicFieldsButtons/DynamicFieldsButtons'
import { FeaturedItemTypeBadge } from './FeaturedItemTypeBadge'
import { BaseFormItem } from './base-form-item/BaseFormItem'
import { DvObjectFormItem } from './dv-object-form-item/DvObjectFormItem'
import { CustomFormItem } from './custom-form-item/CustomFormItem'
import styles from './FeaturedItemField.module.scss'

interface FeaturedItemFieldProps {
  id: string
  itemIndex: number
  onAddField: (index: number) => void
  onRemoveField: (index: number) => void
  onSelectType: (index: number, type: FeaturedItemType.CUSTOM | '' | 'base') => void
  disableDragWhenOnlyOneItem: boolean
  initialImageUrl?: string
  featuredItemType: FeaturedItemType | 'base' | ''
  isExistingItem: boolean
}

export const FeaturedItemField = ({
  id,
  itemIndex,
  onAddField,
  onRemoveField,
  onSelectType,
  disableDragWhenOnlyOneItem,
  initialImageUrl,
  featuredItemType,
  isExistingItem
}: FeaturedItemFieldProps) => {
  const { t: tShared } = useTranslation('shared')
  const [editEnabled, setEditEnabled] = useState(!isExistingItem)

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

  const showCustomFeaturedItemFields = featuredItemType === FeaturedItemType.CUSTOM

  const showDvObjectFeaturedItemFields =
    featuredItemType === FeaturedItemType.COLLECTION ||
    featuredItemType === FeaturedItemType.DATASET ||
    featuredItemType === FeaturedItemType.FILE ||
    featuredItemType === ''

  const isBaseFeaturedItemField = featuredItemType === 'base'

  return (
    <div
      id={id}
      data-featured-item={`featured-item-${itemIndex}`}
      ref={setNodeRef}
      style={style}
      data-testid={`featured-item-${itemIndex.toString()}`}
      className={cn(styles['featured-item-fields-wrapper'], {
        [styles['sorting']]: isSorting,
        [styles['active']]: active?.id === id,
        [styles['edit-disabled']]: !editEnabled
      })}>
      <Row>
        <Col xs={12}>
          <Row className={styles['featured-item-header']}>
            <Col md={1}>{''}</Col>
            <Col md={8} lg={9}>
              <div>
                {!isBaseFeaturedItemField && !isExistingItem && (
                  // TODO:ME - When going back we need to make the user confirm if they want to discard the changes
                  // As this is only shown when the user is editing a new item we can detect the content property and thats it. Check maybe we have a util to do that already in the content rules
                  <Tooltip overlay="Back to featured item type selection" placement="top">
                    <Button
                      onClick={() => onSelectType(itemIndex, 'base')}
                      icon={<ArrowLeft size={16} />}
                      type="button"
                      variant="secondary"
                      size="sm"
                      aria-label="Go back to featured item type selection"
                    />
                  </Tooltip>
                )}
              </div>
            </Col>
            <Col md={3} lg={2}>
              <div className={styles['badges-column']}>
                {featuredItemType !== 'base' && featuredItemType !== '' && (
                  <FeaturedItemTypeBadge type={featuredItemType} />
                )}

                <Badge variant="secondary">Order {itemIndex + 1}</Badge>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col md={1} className={styles['drag-edit-btn-column']}>
              {!isBaseFeaturedItemField && (
                <div>
                  <Tooltip overlay="Toggle edit mode" placement="right">
                    <Button
                      onClick={() => setEditEnabled(!editEnabled)}
                      className={cn(styles['edit-button'], {
                        [styles['edit-disabled']]: !editEnabled
                      })}
                      icon={<Pencil size={18} />}
                      type="button"
                      variant="primary"
                      aria-label="Toggle edit mode"
                    />
                  </Tooltip>
                </div>
              )}

              <button
                type="button"
                ref={setActivatorNodeRef}
                {...attributesCheckingDisabled}
                {...listeners}
                className={cn(styles['drag-handle'], {
                  [styles['disabled']]: disableDragWhenOnlyOneItem
                })}
                aria-label={tShared('dragHandleLabel')}
                disabled={disableDragWhenOnlyOneItem || isBaseFeaturedItemField}>
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
              {isBaseFeaturedItemField && (
                <BaseFormItem itemIndex={itemIndex} onSelectType={onSelectType} />
              )}

              {showCustomFeaturedItemFields && (
                <CustomFormItem
                  itemIndex={itemIndex}
                  editEnabled={editEnabled}
                  initialImageUrl={initialImageUrl}
                />
              )}
              {showDvObjectFeaturedItemFields && (
                <DvObjectFormItem
                  itemIndex={itemIndex}
                  featuredItemType={featuredItemType}
                  editEnabled={editEnabled}
                  isExistingItem={isExistingItem}
                />
              )}
            </Col>
            <Col md={3} lg={2} style={{ marginTop: '2rem' }}>
              <DynamicFieldsButtons
                fieldName="Featured Item"
                onAddButtonClick={() => onAddField(itemIndex)}
                onRemoveButtonClick={() => onRemoveField(itemIndex)}
                originalField={itemIndex === 0}
                hideAddButton={isBaseFeaturedItemField}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
