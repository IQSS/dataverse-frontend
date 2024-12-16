import { Controller, useFormContext } from 'react-hook-form'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Col, Form, RichTextEditor, Row } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { DynamicFieldsButtons } from '@/sections/shared/form/DynamicFieldsButtons/DynamicFieldsButtons'
import styles from './FeaturedItem.module.scss'

interface FeaturedItemProps {
  id: string
  itemIndex: number
  onAddField: (index: number) => void
  onRemoveField: (index: number) => void
  disableDragWhenOnlyOneItem: boolean
}

// TODO:ME - Image just an input image field, no dropzone as it is too small
// TODO:ME - Logic to show the image thumbnail on top of the image input field, if an image is uploaded (use the image field from the form). Add button to remove the image. how that logic could be?

export const FeaturedItem = ({
  id,
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
  } = useSortable({ id })

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
        [styles['active']]: active?.id === id
      })}>
      <Row>
        <Col md={1}>
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
        <Col md={8} lg={9}>
          <Row>
            <Form.Group controlId={`featuredItems.${itemIndex}.title`} as={Col} md={6}>
              <Form.Group.Label required={true}>Title</Form.Group.Label>

              <Controller
                name={`featuredItems.${itemIndex}.title`}
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                  <Col>
                    <Form.Group.Input
                      type="text"
                      value={value as string}
                      aria-required={true}
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
              <Form.Group.Label required={false}>Image</Form.Group.Label>

              <Controller
                name={`featuredItems.${itemIndex}.image`}
                control={control}
                render={({ field }) => (
                  <Col>
                    <div className={styles['image-dropzone']}>
                      <Form.Group.Text>Upload an image</Form.Group.Text>
                    </div>
                  </Col>
                )}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} className={styles['form-group-content']}>
              <Form.Group.Label required={true} id={`featuredItems.${itemIndex}.content`}>
                Content
              </Form.Group.Label>

              <Controller
                name={`featuredItems.${itemIndex}.content`}
                control={control}
                rules={{
                  required: 'Content is required',
                  validate: (value: string) => {
                    if (value === '<p></p>' || value === '') {
                      return 'Content is required'
                    }
                    return true
                  }
                }}
                render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
                  // TODO:ME - Allow passing aria-required to RichTextEditor
                  return (
                    <Col>
                      <RichTextEditor
                        // editorContentId="asd"
                        initialValue={value as string}
                        editorContentAriaLabelledBy={`featuredItems.${itemIndex}.content`}
                        onChange={onChange}
                        invalid={invalid}
                        ref={ref}
                      />

                      {invalid && <div className={styles['error-msg']}>{error?.message}</div>}
                    </Col>
                  )
                }}
              />
            </Form.Group>
          </Row>
        </Col>
        <Col md={3} lg={2} style={{ marginTop: '2rem' }}>
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
