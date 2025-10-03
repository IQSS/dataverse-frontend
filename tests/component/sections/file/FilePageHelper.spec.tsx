import { FilePageHelper } from '@/sections/file/FilePageHelper'
import { ExternalTool, ToolScope, ToolType } from '@/externalTools/domain/models/ExternalTool'

describe('FilePageHelper', () => {
  const t = (key: string) => key

  const makeTool = (
    id: number,
    types: ToolType[],
    contentType: string,
    scope: ToolScope = ToolScope.File,
    displayName = `Tool-${id}`
  ): ExternalTool => ({
    id,
    displayName,
    description: `${displayName} description`,
    types,
    scope,
    contentType
  })

  describe('defineDefaultActiveTab', () => {
    it('returns "metadata" when there are no external tools', () => {
      const result = FilePageHelper.defineDefaultActiveTab([], 'text/csv')
      expect(result).to.equal('metadata')
    })

    it('returns "extTool" tab when there is at least one applicable preview tool', () => {
      const tools: ExternalTool[] = [
        makeTool(1, [ToolType.Preview], 'text/csv'),
        makeTool(2, [ToolType.Configure], 'text/csv')
      ]

      const result = FilePageHelper.defineDefaultActiveTab(tools, 'text/csv')
      expect(result).to.equal(FilePageHelper.EXT_TOOL_TAB_KEY)
    })

    it('returns "metadata" when tools exist but none applicable for file type', () => {
      const tools: ExternalTool[] = [makeTool(1, [ToolType.Preview], 'application/json')]
      const result = FilePageHelper.defineDefaultActiveTab(tools, 'text/csv')
      expect(result).to.equal('metadata')
    })
  })

  describe('getApplicablePreviewOrQueryToolsForFileType', () => {
    it('returns empty when fileType is undefined', () => {
      const tools: ExternalTool[] = [
        makeTool(1, [ToolType.Preview], 'text/csv'),
        makeTool(2, [ToolType.Query], 'text/csv')
      ]

      const result = FilePageHelper.getApplicablePreviewOrQueryToolsForFileType(tools)
      expect(result).to.deep.equal([])
    })

    it('filters by scope=file and only preview/query types and matching content type', () => {
      const tools: ExternalTool[] = [
        makeTool(1, [ToolType.Preview], 'text/csv'), // include
        makeTool(2, [ToolType.Query], 'text/csv'), // include
        makeTool(3, [ToolType.Explore], 'text/csv'), // exclude - wrong tool type
        makeTool(4, [ToolType.Configure], 'text/csv'), // exclude - wrong tool type
        { ...makeTool(5, [ToolType.Preview], 'text/csv'), scope: ToolScope.Dataset } // exclude - wrong scope
      ]

      const result = FilePageHelper.getApplicablePreviewOrQueryToolsForFileType(tools, 'text/csv')

      expect(result.map((t) => t.id)).to.deep.equal([1, 2])
    })
  })

  describe('getApplicableToolsForFileType', () => {
    it('returns empty when fileType is undefined', () => {
      const tools: ExternalTool[] = [makeTool(1, [ToolType.Preview], 'text/csv')]
      const result = FilePageHelper.getApplicableToolsForFileType(tools)
      expect(result).to.deep.equal([])
    })

    it('returns all tools with scope=file and matching content type regardless of type', () => {
      const tools: ExternalTool[] = [
        makeTool(1, [ToolType.Preview], 'text/csv'),
        makeTool(2, [ToolType.Query], 'text/csv'),
        makeTool(3, [ToolType.Explore], 'text/csv'),
        makeTool(4, [ToolType.Configure], 'text/csv'),
        { ...makeTool(5, [ToolType.Preview], 'text/csv'), scope: ToolScope.Dataset }
      ]

      const result = FilePageHelper.getApplicableToolsForFileType(tools, 'text/csv')
      expect(result.map((t) => t.id)).to.deep.equal([1, 2, 3, 4])
    })
  })

  describe('getExternalToolTabTitle', () => {
    it('returns tabs.preview when single applicable preview tool matches file type', () => {
      const tools = [makeTool(1, [ToolType.Preview], 'text/csv')]
      const result = FilePageHelper.getExternalToolTabTitle(tools, t, 'text/csv')
      expect(result).to.equal('tabs.preview')
    })

    it('returns tabs.query when single applicable query tool matches file type', () => {
      const tools = [makeTool(1, [ToolType.Query], 'application/json')]
      const result = FilePageHelper.getExternalToolTabTitle(tools, t, 'application/json')
      expect(result).to.equal('tabs.query')
    })

    it('returns tabs.fileTools when more than one applicable tool', () => {
      const tools = [
        makeTool(1, [ToolType.Preview], 'text/csv'),
        makeTool(2, [ToolType.Query], 'text/csv')
      ]
      const result = FilePageHelper.getExternalToolTabTitle(tools, t, 'text/csv')
      expect(result).to.equal('tabs.fileTools')
    })

    it('returns tabs.preview when there are no applicable tools', () => {
      const tools: ExternalTool[] = []
      const result = FilePageHelper.getExternalToolTabTitle(tools, t, 'text/csv')
      expect(result).to.equal('tabs.preview')
    })

    it('returns tabs.preview when single tool exists but file type mismatches', () => {
      const tools = [makeTool(1, [ToolType.Query], 'application/json')]
      const result = FilePageHelper.getExternalToolTabTitle(tools, t, 'text/csv')
      expect(result).to.equal('tabs.preview')
    })
  })

  describe('getDefaultSelectedToolId', () => {
    it('selects tool by matching type from query param', () => {
      const tools = [
        makeTool(1, [ToolType.Preview], 'text/csv'),
        makeTool(2, [ToolType.Query], 'text/csv')
      ]
      const result = FilePageHelper.getDefaultSelectedToolId('query', tools)
      expect(result).to.equal(2)
    })

    it('falls back to first tool when query param is set but no type matches', () => {
      const tools = [
        makeTool(5, [ToolType.Preview], 'text/csv'),
        makeTool(6, [ToolType.Preview], 'text/csv')
      ]
      const result = FilePageHelper.getDefaultSelectedToolId('query', tools)
      expect(result).to.equal(5)
    })

    it('falls back to first tool when query param is undefined', () => {
      const tools = [
        makeTool(9, [ToolType.Query], 'text/csv'),
        makeTool(10, [ToolType.Preview], 'text/csv')
      ]
      const result = FilePageHelper.getDefaultSelectedToolId(undefined, tools)
      expect(result).to.equal(9)
    })
  })

  describe('replacePreviewParamInToolUrl', () => {
    it('adds preview param when not present', () => {
      const original = 'https://example.com/tool'
      const result = FilePageHelper.replacePreviewParamInToolUrl(original, true)
      const u = new URL(result)
      expect(u.origin + u.pathname).to.equal('https://example.com/tool')
      expect(u.searchParams.get('preview')).to.equal('true')
    })

    it('replaces preview param when already present', () => {
      const original = 'https://example.com/tool?a=1&preview=false'
      const result = FilePageHelper.replacePreviewParamInToolUrl(original, true)
      const u = new URL(result)
      expect(u.searchParams.get('a')).to.equal('1')
      expect(u.searchParams.get('preview')).to.equal('true')
    })
  })
})
