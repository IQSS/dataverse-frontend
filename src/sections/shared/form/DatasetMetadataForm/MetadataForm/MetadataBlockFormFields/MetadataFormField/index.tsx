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
  displayName: string
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
      isFieldThatMayBecomeRequired?: never
      childFieldNamesThatTriggerRequired?: never
    }
  | {
      metadataFieldInfo: MetadataField
      metadataBlockName: string
      fieldsArrayIndex?: number
      withinMultipleFieldsGroup: true
      compoundParentName: string
      compoundParentIsRequired: boolean
      isFieldThatMayBecomeRequired: boolean
      childFieldNamesThatTriggerRequired: string[]
    }

export const MetadataFormField = ({
  metadataFieldInfo,
  metadataBlockName,
  fieldsArrayIndex,
  withinMultipleFieldsGroup = false,
  compoundParentName,
  compoundParentIsRequired,
  isFieldThatMayBecomeRequired,
  childFieldNamesThatTriggerRequired
}: DynamicMetadataFormFieldProps) => {
  const {
    name,
    displayName,
    type,
    title,
    multiple,
    typeClass,
    description,
    watermark,
    childMetadataFields,
    controlledVocabularyValues,
    isRequired
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

  const notRequiredWithChildFieldsRequired =
    isSafeCompound &&
    !isRequired &&
    Object.keys(childMetadataFields).some((key) => childMetadataFields[key].isRequired)

  const rulesToApply = useDefineRules({
    metadataFieldInfo,
    isParentFieldRequired: compoundParentIsRequired
  })

  if (isSafePrimitive) {
    if (multiple) {
      return (
        <PrimitiveMultiple
          name={name}
          type={type}
          title={title}
          watermark={watermark}
          displayName={displayName}
          description={description}
          rulesToApply={rulesToApply}
          metadataBlockName={metadataBlockName}
        />
      )
    }
    return (
      <Primitive
        name={name}
        type={type}
        title={title}
        watermark={watermark}
        displayName={displayName}
        description={description}
        rulesToApply={rulesToApply}
        fieldsArrayIndex={fieldsArrayIndex}
        metadataBlockName={metadataBlockName}
        compoundParentName={compoundParentName}
        withinMultipleFieldsGroup={withinMultipleFieldsGroup}
        isFieldThatMayBecomeRequired={isFieldThatMayBecomeRequired}
        childFieldNamesThatTriggerRequired={childFieldNamesThatTriggerRequired}
      />
    )
  }

  if (isSafeControlledVocabulary) {
    if (multiple) {
      return (
        <VocabularyMultiple
          name={name}
          type={type}
          title={title}
          watermark={watermark}
          displayName={displayName}
          description={description}
          rulesToApply={rulesToApply}
          options={controlledVocabularyValues}
          compoundParentName={compoundParentName}
          metadataBlockName={metadataBlockName}
        />
      )
    }
    return (
      <Vocabulary
        name={name}
        type={type}
        title={title}
        watermark={watermark}
        description={description}
        displayName={displayName}
        rulesToApply={rulesToApply}
        options={controlledVocabularyValues}
        fieldsArrayIndex={fieldsArrayIndex}
        metadataBlockName={metadataBlockName}
        compoundParentName={compoundParentName}
        withinMultipleFieldsGroup={withinMultipleFieldsGroup}
      />
    )
  }

  if (isSafeCompound) {
    if (multiple) {
      return (
        <ComposedFieldMultiple
          name={name}
          type={type}
          title={title}
          watermark={watermark}
          description={description}
          displayName={displayName}
          rulesToApply={rulesToApply}
          metadataBlockName={metadataBlockName}
          compoundParentName={compoundParentName}
          childMetadataFields={childMetadataFields}
          notRequiredWithChildFieldsRequired={notRequiredWithChildFieldsRequired}
        />
      )
    }

    return (
      <ComposedField
        name={name}
        type={type}
        title={title}
        watermark={watermark}
        description={description}
        displayName={displayName}
        rulesToApply={rulesToApply}
        metadataBlockName={metadataBlockName}
        compoundParentName={compoundParentName}
        childMetadataFields={childMetadataFields}
        notRequiredWithChildFieldsRequired={notRequiredWithChildFieldsRequired}
      />
    )
  }

  return null
}
