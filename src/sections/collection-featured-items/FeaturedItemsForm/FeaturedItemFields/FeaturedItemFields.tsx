import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import styles from './FeaturedItemFields.module.scss'

interface FeaturedItemFieldsProps {
  itemIndex: number
}

export const FeaturedItemFields = ({ itemIndex }: FeaturedItemFieldsProps) => {
  const { control } = useFormContext()
  return (
    <div>
      <Row>
        <Form.Group controlId={`featuredItems.${itemIndex}.title`} as={Col} md={6}>
          <Form.Group.Label
            message="This will be the title of the featured item card"
            required={true}>
            Title
          </Form.Group.Label>

          <Controller
            name={`featuredItems.${itemIndex}.title`}
            control={control}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.Group.Input
                  type="text"
                  value={value as string}
                  onChange={onChange}
                  isInvalid={invalid}
                  ref={ref}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            )}
          />
        </Form.Group>
        <Form.Group controlId={`featuredItems.${itemIndex}.image`} as={Col} md={6}>
          <Form.Group.Label
            message="Add an image that will appear alongside the text content in the featured item. Keep the file size reasonable for quick loading"
            required={false}>
            Item Image
          </Form.Group.Label>

          <Controller
            name={`featuredItems.${itemIndex}.image`}
            control={control}
            render={({ field }) => (
              <Col>
                <div className={styles['image-dropzone']}>
                  <Form.Group.Text>Drop an image here or click to upload</Form.Group.Text>
                </div>
              </Col>
            )}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId={`featuredItems.${itemIndex}.content`} as={Col}>
          <Form.Group.Label
            message="This is the main text that will appear on the card. Keep it concise but informative."
            required={true}>
            Content
          </Form.Group.Label>

          <Controller
            name={`featuredItems.${itemIndex}.content`}
            control={control}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.Group.TextArea
                  value={value as string}
                  onChange={onChange}
                  isInvalid={invalid}
                  ref={ref}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            )}
          />
        </Form.Group>
      </Row>
    </div>
  )
}
