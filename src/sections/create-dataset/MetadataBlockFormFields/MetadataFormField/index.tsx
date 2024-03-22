import { Form } from '@iqss/dataverse-design-system'
import {
  MetadataField2,
  TypeClassMetadataField,
  TypeMetadataField
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'

export enum TypeMetadataFieldxx {
  Date = 'DATE',
  Email = 'EMAIL',
  Float = 'FLOAT',
  Int = 'INT',
  None = 'NONE',
  Text = 'TEXT',
  Textbox = 'TEXTBOX',
  URL = 'URL'
}

export enum TypeClassMetadataFieldxx {
  Compound = 'compound',
  ControlledVocabulary = 'controlledVocabulary',
  Primitive = 'primitive'
}

interface Props {
  metadataFieldInfo: MetadataField2
}

export const MetadataFormField = ({ metadataFieldInfo }: Props) => {
  console.log(metadataFieldInfo)
  const {
    name,
    type,
    multiple,
    typeClass,
    isRequired,
    displayName,
    description,
    childMetadataFields,
    controlledVocabularyValues
  } = metadataFieldInfo

  const isSafeCompound =
    typeClass === TypeClassMetadataField.Compound &&
    childMetadataFields !== undefined &&
    Object.keys(childMetadataFields).length > 0

  const isSafeControlledVocabulary =
    typeClass === TypeClassMetadataField.ControlledVocabulary &&
    controlledVocabularyValues !== undefined &&
    controlledVocabularyValues.length > 0

  const isSafePrimitive = typeClass === TypeClassMetadataField.Primitive

  if (isSafePrimitive) {
    return (
      <p>
        <b>{`name: ${name} `}</b>
        ---isSafePrimitive--- {`type: ${type} typeClass: ${typeClass}`}
      </p>
    )
  }

  if (isSafeCompound) {
    return (
      <p>
        <b>{`name: ${name} `}</b>
        ---isSafeCompound--- {`type: ${type} typeClass: ${typeClass}`}
        <ul>
          {Object.entries(childMetadataFields).map(
            ([childMetadataFieldKey, childMetadataFieldInfo]) => {
              return (
                <li key={childMetadataFieldKey}>
                  <MetadataFormField metadataFieldInfo={childMetadataFieldInfo} />
                </li>
              )
            }
          )}
        </ul>
      </p>
    )
  }

  if (isSafeControlledVocabulary) {
    return (
      <p>
        <b>{`name: ${name} `}</b>
        ---isSafeControlledVocabulary--- {`type: ${type} typeClass: ${typeClass}`}
        <ul>
          {controlledVocabularyValues.map((controlledVocabularyValue, index) => {
            return <li key={index}>{controlledVocabularyValue}</li>
          })}
        </ul>
      </p>
    )
  }

  return <p>Not implemented</p>
}

//   return (
//     <Form.Group controlId={metadataFieldInfo.name} required={metadataFieldInfo.isRequired}>
//       <Form.Group.Label message={metadataFieldInfo.description}>
//         {metadataFieldInfo.displayName}
//       </Form.Group.Label>
//       <Form.Group.Input
//         // disabled={submissionStatus === SubmissionStatus.IsSubmitting}
//         type="text"
//         name="metadataBlocks.0.fields.title"
//         // onChange={handleFieldChange}
//         // isInvalid={!!validationErrors.metadataBlocks[0].fields.title}
//       />
//       <Form.Group.Feedback type="invalid">
//         {/* {t('datasetForm.fields.title.feedback')} */}
//       </Form.Group.Feedback>
//     </Form.Group>
//   )
