export interface ExternalTool {
  id: number
  displayName: string
  description: string
  types: ToolType[]
  scope: ToolScope
  contentType?: string // Only present when scope is 'file'
  toolParameters?: { queryParameters?: Record<string, string>[] }
  allowedApiCalls?: { name: string; httpMethod: string; urlTemplate: string; timeOut: number }[]
  requirements?: { auxFilesExist: { formatTag: string; formatVersion: string }[] }
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
