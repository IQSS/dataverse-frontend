import { useCallback, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { ExclamationTriangle, Pencil, Plus, Trash } from 'react-bootstrap-icons'
import cn from 'classnames'
import { Badge, Button, Col, Row, Tooltip, useTheme } from '@iqss/dataverse-design-system'
import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { BaseFormItem } from './base-form-item/BaseFormItem'
import { DvObjectFormItem } from './dv-object-form-item/DvObjectFormItem'
import { CustomFormItem } from './custom-form-item/CustomFormItem'
import { BackToTypeSelectionButton } from './BackToTypeSelectionButton'
import { SwalModalWithModifiedCustomClass } from '@/sections/shared/swal-modal/SwalModal'
import { useShowConfirmDialog } from './useShowConfirmDialog'
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
  itemsLength: number
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
  isExistingItem,
  itemsLength
}: FeaturedItemFieldProps) => {
  const { t: tShared } = useTranslation('shared')
  const [editEnabled, setEditEnabled] = useState(!isExistingItem)
  const shouldShowConfirmRemoveDialog = useShowConfirmDialog({ itemIndex })
  const { color } = useTheme()

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

  const backToTypeSelection = useCallback(
    () => onSelectType(itemIndex, 'base'),
    [itemIndex, onSelectType]
  )

  const isFirstAndOnlyOneItem = itemsLength === 1 && itemIndex === 0

  const requestDeleteConfirmation = async (): Promise<boolean> => {
    const result = await SwalModalWithModifiedCustomClass({
      confirmButton: 'btn btn-danger'
    }).fire({
      title: 'Delete Featured Item',
      showDenyButton: true,
      denyButtonText: tShared('cancel'),
      confirmButtonText: tShared('delete'),
      html: (
        <div className="d-flex align-items-center gap-2 text-warning py-2">
          <ExclamationTriangle size={20} />
          <span>Are you sure you want to delete this featured item?</span>
        </div>
      )
    })

    return result.isConfirmed
  }

  // This is to remove the featured item from the database
  const handleDeleteSingleFeaturedItem = async () => {
    const shouldDelete = await requestDeleteConfirmation()

    if (!shouldDelete) return

    // Call the use case to delete the featured item from the database
  }

  // This is to remove the featured item only from the form data state
  const handleRemoveFeaturedItem = async () => {
    if (shouldShowConfirmRemoveDialog) {
      const shouldRemove = await requestDeleteConfirmation()
      if (shouldRemove) {
        onRemoveField(itemIndex)
      }
    }
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
        [styles['active']]: active?.id === id,
        [styles['edit-disabled']]: !editEnabled
      })}>
      <Row>
        <Col xs={12}>
          <Row className={styles['featured-item-header']}>
            <Col md={1} lg={1}>
              {!isBaseFeaturedItemField && (
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
              )}
            </Col>
            <Col md={8} lg={9}>
              <div>
                {!isBaseFeaturedItemField && !isExistingItem && (
                  <BackToTypeSelectionButton
                    backToTypeSelection={backToTypeSelection}
                    itemIndex={itemIndex}
                  />
                )}
              </div>
            </Col>
            <Col md={3} lg={2} className="text-end">
              <Badge variant="secondary">Order {itemIndex + 1}</Badge>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col md={1} className="mb-2">
              {!isBaseFeaturedItemField && (
                <div>
                  <Tooltip
                    overlay={editEnabled ? 'Disable editing' : 'Enable editing'}
                    placement="right">
                    <Button
                      onClick={() => setEditEnabled(!editEnabled)}
                      className={cn(styles['edit-btn'], {
                        [styles['edit-disabled']]: !editEnabled
                      })}
                      icon={<Pencil size={18} />}
                      type="button"
                      variant="primary"
                      aria-label={editEnabled ? 'Disable editing' : 'Enable editing'}
                    />
                  </Tooltip>
                </div>
              )}
            </Col>
            <Col md={8} lg={9}>
              {/* Allows the user to select to create a CUSTOM or Dataverse Object featured item  */}
              {isBaseFeaturedItemField && (
                <BaseFormItem itemIndex={itemIndex} onSelectType={onSelectType} />
              )}

              {/* Shows the form fields for adding a custom featured item */}
              {showCustomFeaturedItemFields && (
                <CustomFormItem
                  itemIndex={itemIndex}
                  editEnabled={editEnabled}
                  initialImageUrl={initialImageUrl}
                />
              )}

              {/* Shows the form fields for adding a Dataverse Object featured item */}
              {showDvObjectFeaturedItemFields && (
                <DvObjectFormItem
                  itemIndex={itemIndex}
                  featuredItemType={featuredItemType}
                  editEnabled={editEnabled}
                  isExistingItem={isExistingItem}
                />
              )}
            </Col>
            <Col md={3} lg={2}>
              <div className="d-flex flex-wrap gap-3">
                {!isBaseFeaturedItemField && (
                  <Tooltip placement="top" overlay={tShared('add')}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onAddField(itemIndex)}
                      className="px-2"
                      aria-label={`${tShared('add')} Featured Item`}>
                      <Plus title={tShared('add')} size={24} />
                    </Button>
                  </Tooltip>
                )}

                {/* If is an existing item we should prompt a confirmation dialog before deleting the featured item from the DB */}
                {isExistingItem && (
                  <Tooltip placement="top" overlay={'Delete'}>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={handleDeleteSingleFeaturedItem}
                      className="px-2"
                      aria-label={`Delete Featured Item`}>
                      <Trash title={'Delete'} size={24} />
                    </Button>
                  </Tooltip>
                )}

                {/* If is not an existing item we should prompt a confirmation dialog before removing the featured item from the form data state  */}
                {!isExistingItem && !isFirstAndOnlyOneItem && (
                  <Tooltip placement="top" overlay={tShared('remove')}>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => onRemoveField(itemIndex)}
                      className="px-2"
                      aria-label={`${tShared('remove')} Featured Item`}>
                      <Trash title={tShared('remove')} size={24} />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
