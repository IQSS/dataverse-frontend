import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { useCallback, useMemo } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

// TODO:ME Create reusable DynamicFieldsButtons component inside shared Form when merged with issue 422

export const ContactsField = () => {
  const { t } = useTranslation('createCollection')
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
    <Form.Group as={Col} md={6}>
      <Form.Group.Label
        message={t('fields.contacts.description')}
        htmlFor={controlID}
        required={true}>
        {t('fields.contacts.label')}
      </Form.Group.Label>

      {(fieldsArray as { id: string; value: string }[]).map((field, index) => (
        <Row className="mb-3" key={field.id}>
          <Controller
            name={builtFieldNameWithIndex(index)}
            control={control}
            rules={{ required: t('fields.contacts.required') }}
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
                {index === 0 ? (
                  <>
                    <button onClick={() => handleOnAddField(index)} type="button">
                      Add
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleOnRemoveField(index)} type="button">
                      Remove
                    </button>
                    <button onClick={() => handleOnAddField(index)} type="button">
                      Add
                    </button>
                  </>
                )}
                {/* <Col
                  sm={3}
                  className={cn(
                    styles['dynamic-fields-button-container'],
                    styles['on-primitive-multiple']
                  )}>
                  <DynamicFieldsButtons
                    fieldName={title}
                    onAddButtonClick={() => handleOnAddField(index)}
                    onRemoveButtonClick={() => handleOnRemoveField(index)}
                    originalField={index === 0}
                  />
                </Col> */}
              </>
            )}
          />
        </Row>
      ))}
    </Form.Group>
  )
}
