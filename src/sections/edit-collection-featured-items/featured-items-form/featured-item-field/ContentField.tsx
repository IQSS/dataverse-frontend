import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form, RichTextEditor } from '@iqss/dataverse-design-system'
import styles from './FeaturedItemField.module.scss'

interface ContentFieldProps {
  itemIndex: number
  editEnabled: boolean
}

export const FEATURED_ITEM_CONTENT_MAX_LENGTH_ACCEPTED = 15_000

export const ContentField = ({ itemIndex, editEnabled }: ContentFieldProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('editCollectionFeaturedItems')

  const rules: UseControllerProps['rules'] = {
    required: t('form.content.required'),
    maxLength: {
      value: FEATURED_ITEM_CONTENT_MAX_LENGTH_ACCEPTED,
      message: t('form.content.invalid.maxLength', {
        maxLength: FEATURED_ITEM_CONTENT_MAX_LENGTH_ACCEPTED
      })
    },
    validate: (value: string) => {
      const content = value.replace(/<p[^>]*>|<\/p>/g, '').trim()
      const isEmptyTag = content === ''

      if (isEmptyTag || value === '') {
        return t('form.content.required')
      }
      return true
    }
  }

  return (
    <Form.Group as={Col} className={styles['form-group-content']}>
      <Form.Group.Label required={true} id={`featuredItems.${itemIndex}.content`}>
        {t('form.content.label')}
      </Form.Group.Label>

      <Controller
        name={`featuredItems.${itemIndex}.content`}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
          return (
            <Col className={styles['editor-wrapper']}>
              <RichTextEditor
                initialValue={value as string}
                editorContentAriaLabelledBy={`featuredItems.${itemIndex}.content`}
                onChange={onChange}
                invalid={invalid}
                ariaRequired
                ref={ref}
                editorContentId={`featuredItems.${itemIndex}.editorContent`}
                disabled={!editEnabled}
              />

              {invalid && <div className={styles['error-msg']}>{error?.message}</div>}
            </Col>
          )
        }}
      />
    </Form.Group>
  )
}
