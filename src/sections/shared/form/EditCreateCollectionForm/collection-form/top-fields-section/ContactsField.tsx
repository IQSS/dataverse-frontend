import { useCallback, useMemo } from 'react'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { Controller, UseControllerProps, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DynamicFieldsButtons } from '@/sections/shared/form/DynamicFieldsButtons/DynamicFieldsButtons'
import cn from 'classnames'
import styles from './TopFieldsSection.module.scss'

interface ContactsFieldProps {
  rules: UseControllerProps['rules']
}

export const ContactsField = ({ rules }: ContactsFieldProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'collectionForm' })
  const { control } = useFormContext()

  const {
    fields: fieldsArray,
    insert,
    remove
  } = useFieldArray({
    name: 'contacts',
    control: control
  })

  const builtFieldNameWithIndex = useCallback((fieldIndex: number) => {
    return `contacts.${fieldIndex}.value`
  }, [])

  // We give the label the same ID as the first field, so that clicking on the label focuses the first field only
  const controlID = useMemo(() => builtFieldNameWithIndex(0), [builtFieldNameWithIndex])

  const handleOnAddField = (index: number) => {
    insert(
      index + 1,
      { value: '' },
      {
        shouldFocus: true,
        focusName: builtFieldNameWithIndex(index + 1)
      }
    )
  }

  const handleOnRemoveField = (index: number) => remove(index)

  return (
    <Form.Group as={Col}>
      <Form.Group.Label
        message={t('fields.contacts.description')}
        htmlFor={controlID}
        required={true}>
        {t('fields.contacts.label')}
      </Form.Group.Label>

      {(fieldsArray as { id: string; value: string }[]).map((field, index) => (
        <Row className={styles['contact-row']} key={field.id}>
          <Controller
            name={builtFieldNameWithIndex(index)}
            control={control}
            rules={rules}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <>
                <Col sm={9}>
                  <Form.Group.Input
                    type="email"
                    value={value as string}
                    onChange={onChange}
                    isInvalid={invalid}
                    aria-required={true}
                    ref={ref}
                    id={builtFieldNameWithIndex(index)}
                  />

                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Col>
                <Col
                  sm={3}
                  className={cn(
                    styles['dynamic-fields-button-container'],
                    styles['on-primitive-multiple']
                  )}>
                  <DynamicFieldsButtons
                    fieldName="Email"
                    onAddButtonClick={() => handleOnAddField(index)}
                    onRemoveButtonClick={() => handleOnRemoveField(index)}
                    originalField={index === 0}
                  />
                </Col>
              </>
            )}
          />
        </Row>
      ))}
    </Form.Group>
  )
}
