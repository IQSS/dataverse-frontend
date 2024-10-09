import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Button } from '@iqss/dataverse-design-system'
import { FeaturedItem } from './FeaturedItem/FeaturedItem'
import { SortableContext } from '@dnd-kit/sortable'
import styles from './FeaturedItemsForm.module.scss'
import { PreviewCarousel } from './PreviewCarousel/PreviewCarousel'

export type FeaturedItemsFormData = {
  featuredItems: FeaturedItemField[]
}

type FeaturedItemField = {
  title: string
  content: string
  image?: File
}

type FeaturedItemFieldWithId = FeaturedItemField & {
  id: string
}

export const FeaturedItemsForm = () => {
  const defaultValues: FeaturedItemsFormData = {
    featuredItems: [
      {
        title: '',
        content: '',
        image: undefined
      }
    ]
  }

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
      { title: '', content: '', image: undefined },
      {
        shouldFocus: true,
        focusName: `featuredItems.${index + 1}.title`
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
  }

  const submitForm = (data: FeaturedItemsFormData) => {
    console.log(data)
  }

  return (
    <FormProvider {...form}>
      <PreviewCarousel />
      <form
        onSubmit={form.handleSubmit(submitForm)}
        noValidate={true}
        className={styles.form}
        data-testid="collection-form">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button disabled={!form.formState.isDirty}>Save Featured Items</Button>
        </div>
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
          <SortableContext items={fieldsArray}>
            {(fieldsArray as FeaturedItemFieldWithId[]).map((field, index) => (
              <FeaturedItem
                key={field.id}
                itemId={field.id}
                itemIndex={index}
                disableDragWhenOnlyOneItem={fieldsArray.length === 1}
                onAddField={handleOnAddField}
                onRemoveField={handleOnRemoveField}
              />
            ))}
          </SortableContext>
        </DndContext>
      </form>
    </FormProvider>
  )
}
