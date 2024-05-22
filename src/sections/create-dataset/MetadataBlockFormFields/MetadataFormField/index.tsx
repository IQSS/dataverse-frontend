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
  VocabularyMultiple,
  ComposedField,
  ComposedFieldMultiple
} from './Fields'

export interface CommonFieldProps {
  name: string
  rulesToApply: DefinedRules
  description: string
  title: string
  watermark: string
  type: TypeMetadataField
  isRequired: boolean
  withinMultipleFieldsGroup?: boolean
}

interface Props {
  metadataFieldInfo: MetadataField
  metadataBlockName: string
  withinMultipleFieldsGroup?: boolean
  compoundParentName?: string
  fieldsArrayIndex?: number
}

export const MetadataFormField = ({
  metadataFieldInfo,
  metadataBlockName,
  withinMultipleFieldsGroup = false,
  compoundParentName,
  fieldsArrayIndex
}: Props) => {
  const {
    name,
    type,
    title,
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
        fieldsArrayIndex={fieldsArrayIndex}
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
        fieldsArrayIndex={fieldsArrayIndex}
      />
    )
  }

  if (isSafeCompound) {
    if (multiple) {
      return (
        <ComposedFieldMultiple
          name={name}
          compoundParentName={compoundParentName}
          metadataBlockName={metadataBlockName}
          childMetadataFields={childMetadataFields}
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
      <ComposedField
        name={name}
        compoundParentName={compoundParentName}
        metadataBlockName={metadataBlockName}
        childMetadataFields={childMetadataFields}
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
}
