import { TemplateFieldInfo, TemplateInstructionInfo } from './TemplateInfo'

export interface UpdateTemplateMetadataInfo {
  name?: string
  fields?: TemplateFieldInfo[]
  instructions?: TemplateInstructionInfo[]
}
