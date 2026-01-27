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
import { DatasetTemplateInstruction } from '@/templates/domain/models/Template'
import { TemplateInstructionInfo } from '@/templates/domain/models/TemplateInfo'
import { MetadataFieldsHelper } from '../../../MetadataFieldsHelper'

export interface CommonFieldProps {
  name: string
  title: string
  displayName: string
  watermark: string
  description: string
  type: TypeMetadataField
  rulesToApply: DefinedRules
  fieldInstructions?: string
  instructionEditor?: {
    value?: string
    onSave: (instruction: TemplateInstructionInfo) => void
    fieldKey: string
  }
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
      datasetTemplateInstructions?: DatasetTemplateInstruction[]
      templateInstructionValues?: Record<string, TemplateInstructionInfo>
      onTemplateInstructionChange?: (instruction: TemplateInstructionInfo) => void
      suppressInstructionEditor?: boolean
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
      datasetTemplateInstructions?: DatasetTemplateInstruction[]
      templateInstructionValues?: Record<string, TemplateInstructionInfo>
      onTemplateInstructionChange?: (instruction: TemplateInstructionInfo) => void
      suppressInstructionEditor?: boolean
    }

export const MetadataFormField = ({
  metadataFieldInfo,
  metadataBlockName,
  fieldsArrayIndex,
  withinMultipleFieldsGroup = false,
  compoundParentName,
  compoundParentIsRequired,
  isFieldThatMayBecomeRequired,
  childFieldNamesThatTriggerRequired,
  datasetTemplateInstructions,
  templateInstructionValues,
  onTemplateInstructionChange,
  suppressInstructionEditor
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

  const instructionFieldKey = MetadataFieldsHelper.replaceSlashWithDot(name)

  const fieldInstructions: string | undefined = datasetTemplateInstructions?.find(
    (i) => i.instructionField === instructionFieldKey
  )?.instructionText

  const instructionEditor =
    onTemplateInstructionChange !== undefined && !suppressInstructionEditor
      ? {
          value: templateInstructionValues?.[instructionFieldKey]?.instructionText,
          onSave: (instruction: TemplateInstructionInfo) => onTemplateInstructionChange(instruction),
          fieldKey: instructionFieldKey
        }
      : undefined

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
          fieldInstructions={fieldInstructions}
          instructionEditor={instructionEditor}
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
        fieldInstructions={fieldInstructions}
        instructionEditor={instructionEditor}
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
          fieldInstructions={fieldInstructions}
          instructionEditor={instructionEditor}
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
        fieldInstructions={fieldInstructions}
        instructionEditor={instructionEditor}
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
          fieldInstructions={fieldInstructions}
          instructionEditor={instructionEditor}
          templateInstructionValues={templateInstructionValues}
          onTemplateInstructionChange={onTemplateInstructionChange}
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
        fieldInstructions={fieldInstructions}
        instructionEditor={instructionEditor}
        templateInstructionValues={templateInstructionValues}
        onTemplateInstructionChange={onTemplateInstructionChange}
      />
    )
  }

  return null
}
