import { DatasetLicense, DatasetMetadataBlocks, DatasetTermsOfUse } from './Dataset'

export interface DatasetTemplate {
  id: number
  name: string
  collectionAlias: string
  isDefault: boolean
  usageCount: number
  createTime: string
  createDate: string
  // 👇 From Edit Template Metadata
  datasetMetadataBlocks: DatasetMetadataBlocks
  instructions: DatasetTemplateInstruction[]
  // 👇 From Edit Template Terms
  termsOfUse: DatasetTermsOfUse
  license?: DatasetLicense // This license property is going to be present if not custom terms are added in the UI
}

export interface DatasetTemplateInstruction {
  instructionField: string
  instructionText: string
}
