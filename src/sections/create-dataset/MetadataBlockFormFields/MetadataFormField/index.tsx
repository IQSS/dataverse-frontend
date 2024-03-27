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

  if (isSafeControlledVocabulary) {
    if (multiple) {
      return (
        <Form.CheckboxGroup
          title={title}
          message={description}
          required={isRequired}
          isInvalid={false}>
          <div className={styles['checkbox-list-grid']}>
            {controlledVocabularyValues.map((value) => (
              <Form.Group.Checkbox
                name={name}
                label={value}
                id={`${name}-checkbox-${value}`}
                value={value}
                // onChange={(e) => console.log(e)}
                key={value}
              />
            ))}
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
          name={name}
          // onChange={(e) => console.log(e)}
          disabled={false}
          isInvalid={false}
          options={controlledVocabularyValues}
        />
        <Form.Group.Feedback type="invalid">
          Automatically get error from the validation library (Field is required, Field should have
          bla blah, etc.)
        </Form.Group.Feedback>
      </Form.Group>
    )
  }

  if (isSafePrimitive) {
    // Default to a primitive always
    return (
      <Form.Group
        controlId={name}
        required={isRequired}
        as={withinMultipleFieldsGroup ? Col : undefined}>
        <Form.Group.Label message={description}>{title}</Form.Group.Label>
        <>
          {type === TypeMetadataFieldOptions.Text && (
            <TextField
              name={name}
              // onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
            />
          )}
          {type === TypeMetadataFieldOptions.Textbox && (
            <TextBoxField
              name={name}
              // onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
            />
          )}
          {type === TypeMetadataFieldOptions.URL && (
            <UrlField
              name={name}
              // onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
            />
          )}
          {type === TypeMetadataFieldOptions.Email && (
            <EmailField
              name={name}
              // onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
            />
          )}
          {type === TypeMetadataFieldOptions.Int && (
            <IntField
              name={name}
              // onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
            />
          )}
          {type === TypeMetadataFieldOptions.Float && (
            <FloatField
              name={name}
              // onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
            />
          )}
          {type === TypeMetadataFieldOptions.Date && (
            <DateField
              name={name}
              // onChange={(e) => console.log(e)}
              disabled={false}
              isInvalid={false}
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

  return null
}
