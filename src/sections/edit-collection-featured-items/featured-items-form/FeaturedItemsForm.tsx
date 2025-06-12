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
  const hasInitialFeaturedItems = collectionFeaturedItems.length > 0

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

    // These two timeouts are necessary to ensure the new field is focused and scrolled into view
    setTimeout(() => {
      const newFieldEditor = document.getElementById(`featuredItems.${index + 1}.editorContent`)
      newFieldEditor?.focus()
    }, 0)

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
        form.setFocus(`featuredItems.${index}.type`, { shouldSelect: false })
      }, 300)
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
                hasInitialFeaturedItems={hasInitialFeaturedItems}
                onClickDelete={handleOpenDeleteConfirmationModal}
                position="top"
              />
            </div>
          )}

          <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={fieldsArray}>
              {(fieldsArray as FeaturedItemFieldWithSortId[]).map((field, index) => (
                <FeaturedItemField
                  id={field.id}
                  itemIndex={index}
                  disableDragWhenOnlyOneItem={fieldsArray.length === 1}
                  onAddField={handleOnAddField}
                  onRemoveField={handleOnRemoveField}
                  onSelectType={handleSelectType}
                  initialImageUrl={
                    (collectionFeaturedItems as CustomFeaturedItem[]).find(
                      (item) => item.id === field.itemId
                    )?.imageFileUrl
                  }
                  featuredItemType={form.watch(`featuredItems.${index}.type`) as FeaturedItemType}
                  isExistingItem={form.watch(`featuredItems.${index}.itemId`) !== undefined}
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
              hasInitialFeaturedItems={hasInitialFeaturedItems}
              onClickDelete={handleOpenDeleteConfirmationModal}
              position="bottom"
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
