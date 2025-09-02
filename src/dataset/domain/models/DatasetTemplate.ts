import { DatasetLicense, DatasetMetadataFieldValue, DatasetTermsOfUse } from './Dataset'

export interface DatasetTemplate {
  id: number
  name: string
  collectionAlias: string
  isDefault: boolean
  usageCount: number
  createTime: string
  createDate: string
  // 👇 From Edit Template Metadata
  datasetFields: DatasetFields
  instructions: DatasetTemplateInstruction[]
  // 👇 From Edit Template Terms
  termsOfUse: DatasetTermsOfUse
  license?: DatasetLicense // This license property is going to be present if not custom terms are added in the UI
}

type DatasetFields = Record<string, DatasetFieldInfo>

interface DatasetFieldInfo {
  displayName: string
  name: string
  fields: DatasetMetadataFieldValue[]
}
export interface DatasetTemplateInstruction {
  instructionField: string
  instructionText: string
}
