import { Col, Form } from '@iqss/dataverse-design-system'
import {
  MetadataField2,
  TypeClassMetadataFieldOptions,
  TypeMetadataFieldOptions
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DateField,
  EmailField,
  FloatField,
  IntField,
  TextBoxField,
  TextField,
  UrlField,
  Vocabulary
} from './Fields'
import styles from './index.module.scss'

interface Props {
  metadataFieldInfo: MetadataField2
  withinMultipleFieldsGroup?: boolean
}

export const MetadataFormField = ({
  metadataFieldInfo,
  withinMultipleFieldsGroup = false
}: Props) => {
  const {
    name,
    type,
    title,
    multiple,
    typeClass,
    isRequired,
    description,
    childMetadataFields,
    controlledVocabularyValues
  } = metadataFieldInfo

  const isSafeCompound =
    typeClass === TypeClassMetadataFieldOptions.Compound &&
    childMetadataFields !== undefined &&
    Object.keys(childMetadataFields).length > 0

  const isSafeControlledVocabulary =
    typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary &&
    controlledVocabularyValues !== undefined &&
    controlledVocabularyValues.length > 0

  const isSafePrimitive = typeClass === TypeClassMetadataFieldOptions.Primitive

  if (isSafeCompound) {
    return (
      <Form.GroupWithMultipleFields
        title={title}
        message={description}
        required={isRequired}
        withDynamicFields={false}>
        <div className={styles['multiple-fields-grid']}>
          {Object.entries(childMetadataFields).map(
            ([childMetadataFieldKey, childMetadataFieldInfo]) => {
              return (
                <MetadataFormField
                  metadataFieldInfo={childMetadataFieldInfo}
                  withinMultipleFieldsGroup
                  key={childMetadataFieldKey}
                />
              )
            }
          )}
        </div>
      </Form.GroupWithMultipleFields>
    )
  }

  if (isSafePrimitive) {
    return (
      <Form.Group
        controlId={name}
        required={isRequired}
        as={withinMultipleFieldsGroup ? Col : undefined}>
        <Form.Group.Label message={description}>{title}</Form.Group.Label>
        <>
          {type === TypeMetadataFieldOptions.Text && (
            <TextField
              name="someName"
              onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
              isInFieldGroup={withinMultipleFieldsGroup}
            />
          )}
          {type === TypeMetadataFieldOptions.Textbox && (
            <TextBoxField
              name="someName"
              onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
              isInFieldGroup={withinMultipleFieldsGroup}
            />
          )}
          {type === TypeMetadataFieldOptions.URL && (
            <UrlField
              name="someName"
              onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
              isInFieldGroup={withinMultipleFieldsGroup}
            />
          )}
          {type === TypeMetadataFieldOptions.Email && (
            <EmailField
              name="someName"
              onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
              isInFieldGroup={withinMultipleFieldsGroup}
            />
          )}
          {type === TypeMetadataFieldOptions.Int && (
            <IntField
              name="someName"
              onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
              isInFieldGroup={withinMultipleFieldsGroup}
            />
          )}
          {type === TypeMetadataFieldOptions.Float && (
            <FloatField
              name="someName"
              onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
              isInFieldGroup={withinMultipleFieldsGroup}
            />
          )}
          {type === TypeMetadataFieldOptions.Date && (
            <DateField
              name="someName"
              onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
              isInFieldGroup={withinMultipleFieldsGroup}
            />
          )}
        </>
        <Form.Group.Feedback type="invalid">
          Automatically get error from the validation library (Field is required, Field should have
          bla blah, etc.)
        </Form.Group.Feedback>
      </Form.Group>
    )
  }

  if (isSafeControlledVocabulary) {
    if (multiple) {
      return (
        <Form.CheckboxGroup
          title={title}
          message={description}
          required={isRequired}
          isInvalid={false}>
          <div className={styles['checkbox-list-grid']}>
            {controlledVocabularyValues.map((value) => {
              return (
                <Form.Group.Checkbox
                  name="someNameForThisCheckbox"
                  label={value}
                  id={`${title}-checkbox-${value}`}
                  value={value}
                  onChange={(e) => console.log(e)}
                  key={value}
                />
              )
            })}
          </div>
        </Form.CheckboxGroup>
      )
    }
    return (
      <Form.Group
        controlId={name}
        required={isRequired}
        as={withinMultipleFieldsGroup ? Col : undefined}>
        <Form.Group.Label message={description}>{title}</Form.Group.Label>
        <Vocabulary
          name="someName"
          onChange={(e) => console.log(e)}
          disabled={false}
          isInvalid={false}
          isInFieldGroup={withinMultipleFieldsGroup}
          options={controlledVocabularyValues}
        />
        <Form.Group.Feedback type="invalid">
          Automatically get error from the validation library (Field is required, Field should have
          bla blah, etc.)
        </Form.Group.Feedback>
      </Form.Group>
    )
  }

  return <p>Not implemented</p>
}
