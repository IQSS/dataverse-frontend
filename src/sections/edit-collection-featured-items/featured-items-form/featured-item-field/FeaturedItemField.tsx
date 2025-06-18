import { useCallback, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { ExclamationTriangle, Pencil, Plus, Trash } from 'react-bootstrap-icons'
import { WriteError } from '@iqss/dataverse-client-javascript'
import cn from 'classnames'
import { Badge, Button, Col, Row, Tooltip } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { FeaturedItemType } from '@/collection/domain/models/FeaturedItem'
import { BaseFormItem } from './base-form-item/BaseFormItem'
import { DvObjectFormItem } from './dv-object-form-item/DvObjectFormItem'
import { CustomFormItem } from './custom-form-item/CustomFormItem'
import { BackToTypeSelectionButton } from './BackToTypeSelectionButton'
import { SwalModalWithModifiedCustomClass, SwalModal } from '@/sections/shared/swal-modal/SwalModal'
import { useShowConfirmDialog } from './useShowConfirmDialog'
import { deleteCollectionFeaturedItem } from '@/collection/domain/useCases/deleteCollectionFeaturedItem'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { FeaturedItemsFormHelper } from '../FeaturedItemsFormHelper'
import styles from './FeaturedItemField.module.scss'

interface FeaturedItemFieldProps {
  sortableId: string
  itemId: number | undefined // The existing item database id. Used for deletion. Is undefined when creating a new item.
  itemIndex: number
  onAddField: (index: number) => void
  onRemoveField: (index: number) => void
  onSelectType: (index: number, type: FeaturedItemType.CUSTOM | '' | 'base') => void
  collectionRepository: CollectionRepository
  disableDragWhenOnlyOneItem: boolean
  initialImageUrl?: string
  featuredItemType: FeaturedItemType | 'base' | ''
  itemsLength: number
}

export const FeaturedItemField = ({
  sortableId,
  itemId,
  itemIndex,
  onAddField,
  onRemoveField,
  onSelectType,
  collectionRepository,
  disableDragWhenOnlyOneItem,
  initialImageUrl,
  featuredItemType,
  itemsLength
}: FeaturedItemFieldProps) => {
  const isExistingItem = itemId !== undefined && itemId !== null
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('editCollectionFeaturedItems')
  const [editEnabled, setEditEnabled] = useState(!isExistingItem)
  const shouldShowConfirmRemoveDialog = useShowConfirmDialog({ itemIndex })
  const formMethods = useFormContext()

  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    setActivatorNodeRef,
    isSorting,
    active
  } = useSortable({ id: sortableId })

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

  // This is to remove the featured item from the database
  const handleDeleteExistingFeaturedItem = async (featuredItemId: number): Promise<void> => {
    await SwalModalWithModifiedCustomClass({
      confirmButton: 'btn btn-danger'
    }).fire({
      title: t('deleteSingleFeaturedItem.dialog.title'),
      showDenyButton: true,
      denyButtonText: tShared('cancel'),
      confirmButtonText: tShared('delete'),
      html: (
        <div className="d-flex align-items-center gap-2 text-warning py-2">
          <ExclamationTriangle size={20} />
          <span>{t('deleteSingleFeaturedItem.dialog.text')}</span>
        </div>
      ),
      preConfirm: async () => {
        try {
          await deleteCollectionFeaturedItem(collectionRepository, featuredItemId)

          toast.success(t('deleteSingleFeaturedItem.success'))

          // If we are deleting the last item, we should reset the form
          if (itemsLength === 1) {
            formMethods.reset({
              featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems([])
            })
          } else {
            onRemoveField(itemIndex)
          }
        } catch (error) {
          if (error instanceof WriteError) {
            const writeError = new JSDataverseWriteErrorHandler(error)
            const formattedError =
              writeError.getReasonWithoutStatusCode() ?? writeError.getErrorMessage()
            SwalModal.showValidationMessage(formattedError)
          } else {
            SwalModal.showValidationMessage(t('deleteSingleFeaturedItem.defaultError'))
          }
        }
      },
      allowOutsideClick: false,
      allowEscapeKey: false
    })
  }

  const requestRemoveConfirmation = async (): Promise<boolean> => {
    const result = await SwalModal.fire({
      showDenyButton: true,
      denyButtonText: tShared('cancel'),
      confirmButtonText: tShared('continue'),
      html: (
        <div className="d-flex align-items-center gap-2 text-warning py-2">
          <ExclamationTriangle size={20} />
          <span>{t('removeConfirmation')}</span>
        </div>
      ),
      width: 450
    })

    return result.isConfirmed
  }

  // This is to remove the featured item only from the form data state
  const handleRemoveFeaturedItem = async (itemIndex: number) => {
    if (shouldShowConfirmRemoveDialog) {
      const removalConfirmedByUser = await requestRemoveConfirmation()

      if (!removalConfirmedByUser) return
    }

    onRemoveField(itemIndex)
  }

  return (
    <div
      id={sortableId}
      data-featured-item={`featured-item-${itemIndex}`}
      ref={setNodeRef}
      style={style}
      data-testid={`featured-item-${itemIndex.toString()}`}
      className={cn(styles['featured-item-fields-wrapper'], {
        [styles['sorting']]: isSorting,
        [styles['active']]: active?.id === sortableId,
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
              <Badge variant="secondary">
                {t('order')} {itemIndex + 1}
              </Badge>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col md={1} className="mb-2">
              {!isBaseFeaturedItemField && (
                <div>
                  <Tooltip
                    overlay={editEnabled ? t('disableEditing') : t('enableEditing')}
                    placement="right">
                    <Button
                      onClick={() => setEditEnabled(!editEnabled)}
                      className={cn(styles['edit-btn'], {
                        [styles['edit-disabled']]: !editEnabled
                      })}
                      icon={<Pencil size={18} />}
                      type="button"
                      variant="primary"
                      data-testid="toggle-edit"
                      aria-label={editEnabled ? t('disableEditing') : t('enableEditing')}
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
                />
              )}
            </Col>
            <Col md={3} lg={2}>
              <div className="d-flex flex-wrap gap-3">
                {!isBaseFeaturedItemField && (
                  <Tooltip placement="top" overlay={t('addFeaturedItem')}>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => onAddField(itemIndex)}
                      className="px-2"
                      aria-label={t('addFeaturedItem')}>
                      <Plus size={24} aria-hidden="true" />
                    </Button>
                  </Tooltip>
                )}

                {/* If is an existing item we should prompt a confirmation dialog before deleting the featured item from the DB */}
                {isExistingItem && (
                  <Tooltip placement="top" overlay={t('deleteFeaturedItem')}>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleDeleteExistingFeaturedItem(itemId)}
                      disabled={!editEnabled}
                      className="px-2"
                      aria-label={t('deleteFeaturedItem')}>
                      <Trash size={24} aria-hidden="true" />
                    </Button>
                  </Tooltip>
                )}

                {/* If is not an existing item we should prompt a confirmation dialog before removing the featured item from the form data state  */}
                {!isExistingItem && !isFirstAndOnlyOneItem && (
                  <Tooltip placement="top" overlay={t('removeFeaturedItem')}>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleRemoveFeaturedItem(itemIndex)}
                      disabled={!editEnabled}
                      className="px-2"
                      aria-label={t('removeFeaturedItem')}>
                      <Trash size={24} aria-hidden="true" />
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
