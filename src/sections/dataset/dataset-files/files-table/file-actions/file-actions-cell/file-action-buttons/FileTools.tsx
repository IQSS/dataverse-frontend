import { Tooltip, useTheme } from '@iqss/dataverse-design-system'
import { FilePreview } from '@/files/domain/models/FilePreview'
import { ExternalTool, ToolType } from '@/externalTools/domain/models/ExternalTool'
import { FilePageHelper } from '@/sections/file/FilePageHelper'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { EyeFill, Robot } from 'react-bootstrap-icons'

/**
 * This component displays buttons for external tools (preview or query) applicable to the file type.
 * It checks if the user has download permissions before rendering the buttons.
 */

interface FileToolsProps {
  file: FilePreview
  canDownloadFile: boolean
}

export const FileTools = ({ file, canDownloadFile }: FileToolsProps) => {
  const theme = useTheme()
  const { externalTools } = useExternalTools()

  const fileApplicablePreviewOrQueryTools: ExternalTool[] =
    FilePageHelper.getApplicablePreviewOrQueryToolsForFileType(
      externalTools,
      file.metadata.type.value
    )

  const showExternalToolsButtons = fileApplicablePreviewOrQueryTools.length > 0 && canDownloadFile

  if (!showExternalToolsButtons) return null

  return (
    <>
      {fileApplicablePreviewOrQueryTools.map((tool) => (
        <Tooltip placement="top" overlay={tool.displayName} key={tool.id}>
          <LinkToPage
            page={Route.FILES}
            type={DvObjectType.FILE}
            searchParams={{
              id: file.id.toString(),
              datasetVersion: file.datasetVersionNumber.toString(),
              [QueryParamKey.TOOL_TYPE]: tool.types.includes(ToolType.Preview)
                ? ToolType.Preview
                : ToolType.Query
            }}
            className="btn btn-secondary">
            {tool.types.includes(ToolType.Preview) && (
              <EyeFill color={theme.color.primary} size={20} aria-label={`Preview ${file.name}`} />
            )}
            {tool.types.includes(ToolType.Query) && (
              <Robot color={theme.color.primary} size={20} aria-label={`Query ${file.name}`} />
            )}
          </LinkToPage>
        </Tooltip>
      ))}
    </>
  )
}
