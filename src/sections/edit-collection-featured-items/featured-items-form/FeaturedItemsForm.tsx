import { useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext } from '@dnd-kit/sortable'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemField } from './featured-item-field/FeaturedItemField'
import { PreviewCarousel } from './PreviewCarousel'
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
    move
  } = useFieldArray({
    name: 'featuredItems',
    control: form.control
  })

  const handleOnAddField = (index: number) => {
    insert(
      index + 1,
      { content: '', image: null },
      {
        shouldFocus: true,
        focusName: `featuredItems.${index + 1}.content`
      }
    )
  }

  const handleOnRemoveField = (index: number) => remove(index)

  const handleDragEnd = (event: DragEndEvent) => {
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
                  initialImageUrl={
                    collectionFeaturedItems.find((item) => item.id === field.itemId)?.imageFileUrl
                  }
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
