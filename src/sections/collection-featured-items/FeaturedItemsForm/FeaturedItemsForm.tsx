import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Button, Form, QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import { FeaturedItem } from './FeaturedItem/FeaturedItem'
import { SortableContext } from '@dnd-kit/sortable'
import styles from './FeaturedItemsForm.module.scss'
import { PreviewCarousel } from './PreviewCarousel/PreviewCarousel'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

export type FeaturedItemsFormData = {
  featuredItems: FeaturedItemField[]
  withShowDataButton: boolean
}

type FeaturedItemField = {
  title: string
  content: string
  image?: {
    file: File
    altText: string
  }
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
    ],
    withShowDataButton: true
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

  const formFieldsToFeaturedItems: CollectionFeaturedItem[] = form
    .watch('featuredItems')
    .map((field) => {
      const { title, content, image } = field

      if (image?.file) {
        const url = URL.createObjectURL(image.file)
        return { title, content, image: { url, altText: image.altText } }
      }

      return { title, content }
    })

  return (
    <FormProvider {...form}>
      <PreviewCarousel currentFormFeaturedItems={formFieldsToFeaturedItems} />
      <form
        onSubmit={form.handleSubmit(submitForm)}
        noValidate={true}
        className={styles.form}
        data-testid="collection-form">
        {fieldsArray.length > 3 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button disabled={!form.formState.isDirty}>Save Featured Items</Button>
          </div>
        )}

        <Controller
          name="withShowDataButton"
          control={form.control}
          render={({ field: { onChange, ref, value } }) => (
            <div className={styles['show-data-checkbox-wrapper']}>
              <Form.Group.Checkbox
                id="withShowDataButton"
                onChange={onChange}
                label="Show data by default"
                checked={value}
                ref={ref}
              />
              <QuestionMarkTooltip
                placement="right"
                message="If this option is unchecked, the collections, datasets, and files list will not appear by default. To display them, the user will need to click a button located below the carousel."
              />
            </div>
          )}
        />

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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button disabled={!form.formState.isDirty}>Save Featured Items</Button>
        </div>
      </form>
    </FormProvider>
  )
}
