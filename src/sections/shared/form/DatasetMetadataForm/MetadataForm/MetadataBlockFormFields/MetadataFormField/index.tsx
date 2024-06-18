import { DefinedRules, useDefineRules } from './useDefineRules'
import {
  Primitive,
  PrimitiveMultiple,
  Vocabulary,
  VocabularyMultiple,
  ComposedField,
  ComposedFieldMultiple
} from './Fields'
import {
  TypeClassMetadataFieldOptions,
  type MetadataField,
  type TypeMetadataField
} from '../../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'

export interface CommonFieldProps {
  name: string
  title: string
  watermark: string
  description: string
  type: TypeMetadataField
  rulesToApply: DefinedRules
}

type DynamicMetadataFormFieldProps =
  | {
      metadataFieldInfo: MetadataField
      metadataBlockName: string
      fieldsArrayIndex?: number
      withinMultipleFieldsGroup?: false
      compoundParentName?: never
      compoundParentIsRequired?: never
    }
  | {
      metadataFieldInfo: MetadataField
      metadataBlockName: string
      fieldsArrayIndex?: number
      withinMultipleFieldsGroup: true
      compoundParentName: string
      compoundParentIsRequired: boolean
    }

export const MetadataFormField = ({
  metadataFieldInfo,
  metadataBlockName,
  fieldsArrayIndex,
  withinMultipleFieldsGroup = false,
  compoundParentName,
  compoundParentIsRequired
}: DynamicMetadataFormFieldProps) => {
  const {
    name,
    type,
    title,
    multiple,
    typeClass,
    description,
    watermark,
    childMetadataFields,
    controlledVocabularyValues
  } = metadataFieldInfo

  const rulesToApply = useDefineRules({
    metadataFieldInfo,
    isParentFieldRequired: compoundParentIsRequired
  })

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
      />
    )
  }

  return null
}
