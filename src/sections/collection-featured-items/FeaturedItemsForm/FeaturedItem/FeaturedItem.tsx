import { Controller, useFormContext } from 'react-hook-form'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { DynamicFieldsButtons } from '@/sections/shared/form/DynamicFieldsButtons/DynamicFieldsButtons'
import styles from './FeaturedItem.module.scss'

interface FeaturedItemProps {
  itemId: string
  itemIndex: number
  onAddField: (index: number) => void
  onRemoveField: (index: number) => void
  disableDragWhenOnlyOneItem: boolean
}

export const FeaturedItem = ({
  itemId,
  itemIndex,
  onAddField,
  onRemoveField,
  disableDragWhenOnlyOneItem
}: FeaturedItemProps) => {
  const { control } = useFormContext()
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    setActivatorNodeRef,
    isSorting,
    active
  } = useSortable({ id: itemId })

  const attributesCheckingDisabled = disableDragWhenOnlyOneItem
    ? { ...attributes, ['aria-disabled']: true, tabIndex: -1 }
    : attributes

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      {...attributesCheckingDisabled}
      style={style}
      className={cn(styles['featured-item-fields-wrapper'], {
        [styles['sorting']]: isSorting,
        [styles['active']]: active?.id === itemId
      })}>
      <Row>
        <Col sm={1}>
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...listeners}
            className={cn(styles['drag-handle'], {
              [styles['disabled']]: disableDragWhenOnlyOneItem
            })}
            aria-label="press space to select and keys to drag"
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
        </Col>
        <Col sm={8}>
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
                rules={{ required: 'Title is required' }}
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
                      rows={3}
                      ref={ref}
                    />
                    <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                  </Col>
                )}
              />
            </Form.Group>
          </Row>
        </Col>
        <Col sm={3} style={{ marginTop: '2rem' }}>
          <DynamicFieldsButtons
            fieldName="Featured Item"
            onAddButtonClick={() => onAddField(itemIndex)}
            onRemoveButtonClick={() => onRemoveField(itemIndex)}
            originalField={itemIndex === 0}
          />
        </Col>
      </Row>
    </div>
  )
}
