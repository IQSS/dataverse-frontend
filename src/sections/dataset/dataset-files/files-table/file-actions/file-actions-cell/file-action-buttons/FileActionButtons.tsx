import { useTranslation } from 'react-i18next'
import { ButtonGroup, Tooltip, useTheme } from '@iqss/dataverse-design-system'
import { EyeFill } from 'react-bootstrap-icons'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { FilePreview } from '@/files/domain/models/FilePreview'
import { DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { AccessFileMenu } from '@/sections/file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { Route } from '@/sections/Route.enum'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'

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
  const { externalTools } = useExternalTools()
  const filePreviewExternalTool: ExternalTool[] = externalTools.filter(
    (tool) => tool.contentType === file.metadata.type.value
  )

  return (
    <ButtonGroup aria-label={t('actions.buttons')}>
      {filePreviewExternalTool.length > 0 && (
        <Tooltip placement="top" overlay={filePreviewExternalTool[0].displayName}>
          <LinkToPage
            page={Route.FILES}
            type={DvObjectType.FILE}
            searchParams={{
              id: file.id.toString(),
              datasetVersion: file.datasetVersionNumber.toSearchParam()
            }}
            className="btn btn-secondary">
            <EyeFill color={theme.color.primary} size={20} />
          </LinkToPage>
        </Tooltip>
      )}

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
