import { DefinedRules, useDefineRules } from './useDefineRules'
import {
  MetadataField,
  TypeClassMetadataFieldOptions,
  TypeMetadataField
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  Primitive,
  PrimitiveMultiple,
  Vocabulary,
  VocabularyMultiple
  // ComposedField,
  // ComposedFieldMultiple
} from './Fields'

export interface CommonFieldProps {
  name: string
  rulesToApply: DefinedRules
  description: string
  title: string
  watermark: string
  type: TypeMetadataField
  isRequired: boolean
  withinMultipleFieldsGroup: boolean
}

interface Props {
  metadataFieldInfo: MetadataField
  metadataBlockName: string
  withinMultipleFieldsGroup?: boolean
  compoundParentName?: string
}

export const MetadataFormField = ({
  metadataFieldInfo,
  metadataBlockName,
  withinMultipleFieldsGroup = false,
  compoundParentName
}: Props) => {
  const {
    name,
    type,
    title,
    displayName,
    multiple,
    typeClass,
    isRequired,
    description,
    watermark,
    childMetadataFields,
    controlledVocabularyValues
  } = metadataFieldInfo

  const rulesToApply = useDefineRules({ metadataFieldInfo })

  const isSafeCompound =
    typeClass === TypeClassMetadataFieldOptions.Compound &&
    childMetadataFields !== undefined &&
    Object.keys(childMetadataFields).length > 0

  const isSafeControlledVocabulary =
    typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary &&
    controlledVocabularyValues !== undefined &&
    controlledVocabularyValues.length > 0

  const isSafePrimitive = typeClass === TypeClassMetadataFieldOptions.Primitive

  if (isSafePrimitive) {
    if (multiple) {
      return (
        <PrimitiveMultiple
          rulesToApply={rulesToApply}
          metadataBlockName={metadataBlockName}
          name={name}
          description={description}
          title={title}
          watermark={watermark}
          type={type}
          isRequired={isRequired}
          withinMultipleFieldsGroup={withinMultipleFieldsGroup}
        />
      )
    }
    return (
      <Primitive
        name={name}
        compoundParentName={compoundParentName}
        metadataBlockName={metadataBlockName}
        rulesToApply={rulesToApply}
        description={description}
        title={title}
        watermark={watermark}
        type={type}
        isRequired={isRequired}
        withinMultipleFieldsGroup={withinMultipleFieldsGroup}
      />
    )
  }

  if (isSafeControlledVocabulary) {
    if (multiple) {
      return (
        <VocabularyMultiple
          name={name}
          compoundParentName={compoundParentName}
          metadataBlockName={metadataBlockName}
          options={controlledVocabularyValues}
          rulesToApply={rulesToApply}
          description={description}
          title={title}
          watermark={watermark}
          type={type}
          isRequired={isRequired}
          withinMultipleFieldsGroup={withinMultipleFieldsGroup}
        />
      )
    }
    return (
      <Vocabulary
        name={name}
        compoundParentName={compoundParentName}
        metadataBlockName={metadataBlockName}
        options={controlledVocabularyValues}
        rulesToApply={rulesToApply}
        description={description}
        title={title}
        watermark={watermark}
        type={type}
        isRequired={isRequired}
        withinMultipleFieldsGroup={withinMultipleFieldsGroup}
      />
    )
  }

  return null

  // if (isSafeCompound) {
  //   if (multiple) {
  //     return <ComposedFieldMultiple />
  //   }

  //   return <ComposedField />

  //   // return (
  //   //   <Form.GroupWithMultipleFields
  //   //     title={title}
  //   //     message={description}
  //   //     required={isRequired}
  //   //     withDynamicFields={false}>
  //   //     <div className={styles['multiple-fields-grid']}>
  //   //       {Object.entries(childMetadataFields).map(
  //   //         ([childMetadataFieldKey, childMetadataFieldInfo]) => {
  //   //           return (
  //   //             <MetadataFormField
  //   //               metadataFieldInfo={childMetadataFieldInfo}
  //   //               metadataBlockName={metadataBlockName}
  //   //               compoundParentName={name}
  //   //               withinMultipleFieldsGroup
  //   //               key={childMetadataFieldKey}
  //   //             />
  //   //           )
  //   //         }
  //   //       )}
  //   //     </div>
  //   //   </Form.GroupWithMultipleFields>
  //   // )
  // }
}
