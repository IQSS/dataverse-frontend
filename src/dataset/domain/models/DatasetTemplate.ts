type DatasetTemplateMetadataBlockInstruction = Record<string, string>

export interface DatasetTemplate {
  id: string
  metadataBlocksInstructions: DatasetTemplateMetadataBlockInstruction[]
}
