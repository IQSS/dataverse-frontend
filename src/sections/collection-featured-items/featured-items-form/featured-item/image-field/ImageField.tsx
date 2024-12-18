import { ChangeEvent } from 'react'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'
import styles from './ImageField.module.scss'

// TODO:ME - Logic to show the image thumbnail on top of the image input field, if an image is uploaded (use the image field from the form). Add button to remove the image. how that logic could be?
// TODO:ME - How to infer value type like in other forms? edit collection page check
interface ImageFieldProps {
  itemIndex: number
}

export const ImageField = ({ itemIndex }: ImageFieldProps) => {
  const { control } = useFormContext()

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    console.log(e.target.files?.[0])
    const file = e.target.files?.[0]
    formOnChange(file)
  }

  const rules: UseControllerProps['rules'] = {}

  return (
    <Form.Group controlId={`featuredItems.${itemIndex}.image`} as={Col} md={6}>
      <Form.Group.Label required={false}>Image</Form.Group.Label>

      {/* TODO: How to infer value type like in other forms? edit collection page check */}
      <Controller
        name={`featuredItems.${itemIndex}.image`}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
          console.log({ value })
          console.log(typeof value)
          console.log(value instanceof File)

          const isNewFileSelected = value instanceof File
          const isExistingFile = typeof value === 'string' && value !== ''
          const noFileSelected = !isNewFileSelected && !isExistingFile

          //   ChangeEvent<HTMLInputElement>

          return (
            <Col>
              <Form.Group.Input
                type="file"
                accept=".png, .jpg, .jpeg, .webp"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, onChange)}
              />

              {/* <input type="file" onChange={(e) => console.log(e.target.files)} /> */}
            </Col>
          )
        }}
      />
    </Form.Group>
  )
}
