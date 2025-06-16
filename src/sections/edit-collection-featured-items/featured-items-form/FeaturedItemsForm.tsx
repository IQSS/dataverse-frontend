import { useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemField } from './featured-item-field/FeaturedItemField'
import { PreviewCarousel } from './preview-carousel/PreviewCarousel'
import { FeaturedItemFieldWithSortId, FeaturedItemsFormData } from '../types'
import { SubmissionStatus, useSubmitFeaturedItems } from './useSubmitFeaturedItems'
import { useDeleteFeaturedItems } from './useDeleteFeaturedItems'
import { ActionButtons } from './ActionButtons'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import styles from './FeaturedItemsForm.module.scss'

interface FeaturedItemsFormProps {
  collectionId: string
  collectionRepository: CollectionRepository
  defaultValues: FeaturedItemsFormData
  collectionFeaturedItems: CollectionFeaturedItem[]
}

export const FeaturedItemsForm = ({
  collectionId,
  collectionRepository,
  defaultValues,
  collectionFeaturedItems
}: FeaturedItemsFormProps) => {
  const { t } = useTranslation('editCollectionFeaturedItems')
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)

  const { submitForm, submissionStatus } = useSubmitFeaturedItems(
    collectionId,
    collectionRepository
  )

  const { deleteFeaturedItems, isDeletingFeaturedItems } = useDeleteFeaturedItems(
    collectionId,
    collectionRepository
  )

  const form = useForm<FeaturedItemsFormData>({
    mode: 'onChange',
    defaultValues
  })

  const {
    fields: fieldsArray,
    insert,
    remove,
    update,
    move
  } = useFieldArray({
    name: 'featuredItems',
    control: form.control
  })

  const handleOnAddField = (index: number) => {
    if (fieldsArray.length === 10) {
      toast.warning(t('form.maxItemsReached', { maxFeaturedItems: 10 }))
      return
    }

    insert(
      index + 1,
      { type: 'base' },
      {
        shouldFocus: false
      }
    )

    // Scroll the view to the newly added field
    setTimeout(() => {
      const newField = document.querySelector(`[data-featured-item="featured-item-${index + 1}"]`)
      newField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleSelectType = (index: number, type: FeaturedItemType.CUSTOM | '' | 'base') => {
    if (type === FeaturedItemType.CUSTOM) {
      update(index, { type, content: '', image: null })

      setTimeout(() => {
        const newFieldEditor = document.getElementById(`featuredItems.${index}.editorContent`)
        newFieldEditor?.focus()
      }, 150)
    } else if (type === '') {
      update(index, { type: '', dvObjectIdentifier: '', dvObjectUrl: '' })

      setTimeout(() => {
        form.setFocus(`featuredItems.${index}.dvObjectUrl`)
      }, 150)
    } else {
      update(index, { type: 'base' })
    }
  }

  const handleOnRemoveField = (index: number) => remove(index)

  const handleDragEnd = /* istanbul ignore next */ (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over?.id) {
      const activeIndex = (active.data.current?.sortable as { index: number })?.index
      const overIndex = (over.data.current?.sortable as { index: number })?.index

      if (activeIndex !== undefined && overIndex !== undefined) {
        move(activeIndex, overIndex)
      }
    }

    setTimeout(() => {
      const castedActive = active as {
        data: { current?: { sortable?: { index: number; items: string[] } } }
      }
      const activeItemId =
        castedActive.data.current?.sortable?.items[castedActive.data.current?.sortable?.index]

      if (activeItemId) {
        const activeElement = document.getElementById(activeItemId)

        const firstChild = activeElement?.firstElementChild

        if (firstChild) {
          firstChild.scrollIntoView({ behavior: 'instant', block: 'center' })
        }
      }
    }, 0)
  }

  const handleOpenDeleteConfirmationModal = () => setShowConfirmDeleteModal(true)
  const handleCloseModal = () => setShowConfirmDeleteModal(false)

  const handleContinueWithDelete = () => {
    setShowConfirmDeleteModal(false)
    deleteFeaturedItems()
  }

  const showActionButtonsOnTop = fieldsArray.length >= 3

  // We show the delete all button only if there is more than one item with their database IDs
  const showDeleteAllButton =
    fieldsArray.length > 0 && fieldsArray.filter((item) => item.itemId).length > 1

  return (
    <>
      <FormProvider {...form}>
        <PreviewCarousel />

        <form
          onSubmit={form.handleSubmit(submitForm)}
          noValidate={true}
          className={styles.form}
          data-testid="featured-items-form">
          {showActionButtonsOnTop && (
            <div className={styles['actions-wrapper']}>
              <ActionButtons
                isSubmitting={submissionStatus === SubmissionStatus.IsSubmitting}
                isDeletingFeaturedItems={isDeletingFeaturedItems}
                isFormDirty={form.formState.isDirty}
                onClickDelete={handleOpenDeleteConfirmationModal}
              />
            </div>
          )}

          <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={fieldsArray}>
              {(fieldsArray as FeaturedItemFieldWithSortId[]).map((field, index) => (
                <FeaturedItemField
                  sortableId={field.id}
                  itemId={form.watch(`featuredItems.${index}.itemId`)}
                  itemsLength={fieldsArray.length}
                  itemIndex={index}
                  disableDragWhenOnlyOneItem={fieldsArray.length === 1}
                  onAddField={handleOnAddField}
                  onRemoveField={handleOnRemoveField}
                  onSelectType={handleSelectType}
                  collectionRepository={collectionRepository}
                  initialImageUrl={
                    (collectionFeaturedItems as CustomFeaturedItem[]).find(
                      (item) => item.id === field.itemId
                    )?.imageFileUrl
                  }
                  featuredItemType={form.watch(`featuredItems.${index}.type`) as FeaturedItemType}
                  key={field.id}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className={styles['actions-wrapper']}>
            <ActionButtons
              isSubmitting={submissionStatus === SubmissionStatus.IsSubmitting}
              isDeletingFeaturedItems={isDeletingFeaturedItems}
              isFormDirty={form.formState.isDirty}
              onClickDelete={handleOpenDeleteConfirmationModal}
              showDeleteAllButton={showDeleteAllButton}
            />
          </div>
        </form>
      </FormProvider>
      <ConfirmDeleteModal
        show={showConfirmDeleteModal}
        handleClose={handleCloseModal}
        handleContinue={handleContinueWithDelete}
      />
    </>
  )
}
