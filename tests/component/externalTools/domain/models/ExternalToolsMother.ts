import { ToolScope, ToolType } from '@/externalTools/domain/models/ExternalTool'
import { ExternalTool } from '@iqss/dataverse-client-javascript'

export class ExternalToolsMother {
  static createList(props?: Partial<ExternalTool>): ExternalTool[] {
    return [
      this.createDatasetExploreTool(),
      this.createFilePreviewTool(),
      this.createFileExploreTool()
    ].map((tool) => ({ ...tool, ...props }))
  }

  static createDatasetExploreTool(): ExternalTool {
    return {
      id: 1,
      displayName: 'Dataset Explore Tool',
      description: 'Description for Dataset Explore Tool',
      scope: ToolScope.Dataset,
      types: [ToolType.Explore]
    }
  }

  static createFilePreviewTool(): ExternalTool {
    return {
      id: 2,
      displayName: 'File Preview Tool',
      description: 'Description for File Preview Tool',
      scope: ToolScope.File,
      types: [ToolType.Preview]
    }
  }

  static createFileExploreTool(): ExternalTool {
    return {
      id: 3,
      displayName: 'File Explore Tool',
      description: 'Description for File Explore Tool',
      scope: ToolScope.File,
      types: [ToolType.Explore]
    }
  }
}
