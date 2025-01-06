import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemField } from './featured-item-field/FeaturedItemField'
import { PreviewCarousel } from './PreviewCarousel'
import { FeaturedItemFieldWithSortId, FeaturedItemsFormData } from '../types'
import { SubmissionStatus, useSubmitFeaturedItems } from './useSubmitFeaturedItems'
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
  const { t: tShared } = useTranslation('shared')

  const { submitForm, submissionStatus } = useSubmitFeaturedItems(
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

  const disableSubmitButton =
    submissionStatus === SubmissionStatus.IsSubmitting || !form.formState.isDirty

  return (
    <FormProvider {...form}>
      <PreviewCarousel />

      <form
        onSubmit={form.handleSubmit(submitForm)}
        noValidate={true}
        className={styles.form}
        data-testid="featured-items-form">
        {fieldsArray.length > 3 && (
          <div className={styles['save-changes-wrapper']}>
            <Button disabled={disableSubmitButton}>{tShared('saveChanges')}</Button>
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
        <div className={styles['save-changes-wrapper']}>
          <Button disabled={disableSubmitButton}>{tShared('saveChanges')}</Button>
        </div>
      </form>
    </FormProvider>
  )
}
