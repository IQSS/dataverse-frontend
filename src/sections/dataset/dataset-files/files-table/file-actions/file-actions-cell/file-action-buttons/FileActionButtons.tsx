import { useTranslation } from 'react-i18next'
import { ButtonGroup, Tooltip, useTheme } from '@iqss/dataverse-design-system'
import { EyeFill, Robot } from 'react-bootstrap-icons'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { FilePreview } from '@/files/domain/models/FilePreview'
import { DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { ExternalTool, ToolType } from '@/externalTools/domain/models/ExternalTool'
import { AccessFileMenu } from '@/sections/file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { FilePageHelper } from '@/sections/file/FilePageHelper'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'

interface FileActionButtonsProps {
  file: FilePreview
  fileRepository: FileRepository
  datasetRepository: DatasetRepository
}
export function FileActionButtons({
  file,
  fileRepository,
  datasetRepository
}: FileActionButtonsProps) {
  const { t } = useTranslation('files')
  const theme = useTheme()
  const isBelow768px = useMediaQuery('(max-width: 768px)')
  const { externalTools } = useExternalTools()
  const fileApplicablePreviewOrQueryTools: ExternalTool[] =
    FilePageHelper.getApplicablePreviewOrQueryToolsForFileType(
      externalTools,
      file.metadata.type.value
    )

  const showExternalToolsButtons =
    fileApplicablePreviewOrQueryTools.length > 0 && file.permissions.canDownloadFile

  return (
    <ButtonGroup aria-label={t('actions.buttons')} vertical={isBelow768px}>
      {showExternalToolsButtons &&
        fileApplicablePreviewOrQueryTools.map((tool) => (
          <Tooltip placement="top" overlay={tool.displayName} key={tool.id}>
            <LinkToPage
              page={Route.FILES}
              type={DvObjectType.FILE}
              searchParams={{
                id: file.id.toString(),
                datasetVersion: file.datasetVersionNumber.toSearchParam(),
                [QueryParamKey.TOOL_TYPE]: tool.types.includes(ToolType.Preview)
                  ? ToolType.Preview
                  : ToolType.Query
              }}
              className="btn btn-secondary">
              {tool.types.includes(ToolType.Preview) && (
                <EyeFill
                  color={theme.color.primary}
                  size={20}
                  aria-label={`Preview ${file.name}`}
                />
              )}
              {tool.types.includes(ToolType.Query) && (
                <Robot color={theme.color.primary} size={20} aria-label={`Query ${file.name}`} />
              )}
            </LinkToPage>
          </Tooltip>
        ))}
      <AccessFileMenu
        id={file.id}
        access={file.access}
        userHasDownloadPermission={file.permissions.canDownloadFile}
        metadata={file.metadata}
        isDeaccessioned={file.datasetPublishingStatus === DatasetPublishingStatus.DEACCESSIONED}
        ingestInProgress={file.ingest.isInProgress}
        asIcon
        isDraft={file.datasetPublishingStatus === DatasetPublishingStatus.DRAFT}
      />
      <FileOptionsMenu
        file={file}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
    </ButtonGroup>
  )
}
