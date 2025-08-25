export interface ExternalTool {
  id: number
  displayName: string
  description: string
  types: ToolType[]
  scope: ToolScope
}

export enum ToolType {
  Explore = 'explore',
  Configure = 'configure',
  Preview = 'preview',
  Query = 'query'
}

export enum ToolScope {
  Dataset = 'dataset',
  File = 'file'
}
