import { ExternalTool, ToolScope, ToolType } from '@/externalTools/domain/models/ExternalTool'

export class FilePageHelper {
  static readonly EXT_TOOL_TAB_KEY = 'extTool'

  static defineDefaultActiveTab(externalTools: ExternalTool[], fileType?: string): string {
    if (this.getApplicablePreviewOrQueryToolsForFileType(externalTools, fileType).length > 0) {
      return this.EXT_TOOL_TAB_KEY
    }

    return 'metadata'
  }

  static getApplicablePreviewOrQueryToolsForFileType(
    externalTools: ExternalTool[],
    fileType?: string
  ): ExternalTool[] {
    return externalTools
      .filter((tool) => tool.scope === ToolScope.File)
      .filter(
        (tool) => tool.types.includes(ToolType.Preview) || tool.types.includes(ToolType.Query)
      )
      .filter((tool) => (fileType ? tool.contentType === fileType : false))
  }

  static getExternalToolTabTitle(
    fileApplicablePreviewOrQueryTools: ExternalTool[],
    t: (key: string) => string,
    fileType?: string
  ): string {
    // Only one tool applicable and is a preview tool
    if (
      fileApplicablePreviewOrQueryTools.length === 1 &&
      fileApplicablePreviewOrQueryTools[0].types.includes(ToolType.Preview) &&
      fileType === fileApplicablePreviewOrQueryTools[0].contentType
    ) {
      return t('tabs.preview')
    }

    // Only one tool applicable and is a query tool
    if (
      fileApplicablePreviewOrQueryTools.length === 1 &&
      fileApplicablePreviewOrQueryTools[0].types.includes(ToolType.Query) &&
      fileType === fileApplicablePreviewOrQueryTools[0].contentType
    ) {
      return t('tabs.query')
    }

    // More than one applicable tool
    if (fileApplicablePreviewOrQueryTools.length > 1) {
      return t('tabs.fileTools')
    }

    return t('tabs.preview')
  }
}
