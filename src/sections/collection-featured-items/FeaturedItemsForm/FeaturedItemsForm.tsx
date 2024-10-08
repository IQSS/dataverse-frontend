import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button, Col, Row } from '@iqss/dataverse-design-system'
import { DynamicFieldsButtons } from '@/sections/shared/form/DynamicFieldsButtons/DynamicFieldsButtons'
import { FeaturedItemFields } from './FeaturedItemFields/FeaturedItemFields'

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

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement | HTMLButtonElement>) => {
    // When pressing Enter, only submit the form  if the user is focused on the submit button itself
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false

    if (!isButton && !isButtonTypeSubmit) e.preventDefault()
  }

  const submitForm = (data: FeaturedItemsFormData) => {
    console.log(data)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        onKeyDown={preventEnterSubmit}
        noValidate={true}
        data-testid="collection-form">
        {(fieldsArray as FeaturedItemFieldWithId[]).map((field, index) => (
          <Row key={field.id}>
            {/* <Controller
              name={`featuredItems.${index}`}
              control={form.control}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <> */}
            <Col sm={9}>
              <FeaturedItemFields itemIndex={index} />
            </Col>
            <Col sm={3} style={{ marginTop: 32 }}>
              <DynamicFieldsButtons
                fieldName="Featured Item"
                onAddButtonClick={() => handleOnAddField(index)}
                onRemoveButtonClick={() => handleOnRemoveField(index)}
                originalField={index === 0}
              />
            </Col>
            {/* </>
              )}
            /> */}
          </Row>
        ))}

        <Button>Save Featured Items</Button>
      </form>
    </FormProvider>
  )
}
