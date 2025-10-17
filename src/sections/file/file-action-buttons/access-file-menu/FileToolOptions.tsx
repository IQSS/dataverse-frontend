import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import {
  BarChartFill as BarChartFillIcon,
  GearFill as GearFillIcon,
  type Icon as IconType
} from 'react-bootstrap-icons'
import { DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { getFileExternalToolResolved } from '@/externalTools/domain/useCases/GetFileExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FilePageHelper } from '../../FilePageHelper'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'

type ToolKind = 'explore' | 'query' | 'configure'

interface FileToolOptionsProps {
  fileId: number
  fileType: string
  kind: ToolKind
}

const FileToolOptions = ({ fileId, fileType, kind }: FileToolOptionsProps) => {
  const { t } = useTranslation('shared')
  const { fileExploreTools, fileQueryTools, fileConfigureTools, externalToolsRepository } =
    useExternalTools()

  /** Per-kind config (single source of truth) */
  const configByKind: Record<
    ToolKind,
    {
      tools: ExternalTool[]
      headerI18nKey: string
      Icon: IconType
    }
  > = {
    explore: { tools: fileExploreTools, headerI18nKey: 'exploreOptions', Icon: BarChartFillIcon },
    query: { tools: fileQueryTools, headerI18nKey: 'queryOptions', Icon: BarChartFillIcon },
    configure: { tools: fileConfigureTools, headerI18nKey: 'configureOptions', Icon: GearFillIcon }
  }

  const { tools, headerI18nKey, Icon } = configByKind[kind]

  if (!tools || tools.length === 0) return null

  const applicableTools = FilePageHelper.getApplicableToolsForFileType(tools, fileType)

  if (applicableTools.length === 0) return null

  return (
    <>
      <DropdownHeader className="d-flex align-items-center gap-1">
        {t(headerI18nKey)}
        <Icon />
      </DropdownHeader>

      {tools.map((tool) => (
        <ToolOption
          key={tool.id}
          toolId={tool.id}
          toolDisplayName={tool.displayName}
          fileId={fileId}
          externalToolsRepository={externalToolsRepository}
        />
      ))}
    </>
  )
}

interface ToolOptionProps {
  toolId: number
  toolDisplayName: string
  fileId: number
  externalToolsRepository: ExternalToolsRepository
}

const ToolOption = ({
  toolId,
  toolDisplayName,
  fileId,
  externalToolsRepository
}: ToolOptionProps) => {
  const [isOpening, setIsOpening] = useState(false)
  const { t, i18n } = useTranslation('shared')
  const openingRef = useRef(false)

  const handleClick = async () => {
    // If already opening, do nothing
    if (openingRef.current) return
    openingRef.current = true
    setIsOpening(true)

    // Open a blank window immediately to avoid popup blockers
    const newWindow = window.open('', '_blank')

    // If the window didn't open, likely due to a popup blocker
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      toast.info(t('allowPopups'))
      openingRef.current = false
      setIsOpening(false)
      return
    }

    try {
      // Set a temporary title on the new window while fetching the tool URL
      newWindow.document.title = `Loading ${toolDisplayName}...`

      const fileExternalTool = await getFileExternalToolResolved(
        externalToolsRepository,
        fileId,
        toolId,
        { preview: false, locale: i18n.language }
      )
      // Change the location of the new window to the tool URL
      newWindow.location.href = fileExternalTool.toolUrlResolved
    } catch (error) {
      // If there's an error, notify the user and close the new window
      toast.error(t('externalToolOpeningFailed'))
      if (!newWindow?.closed) newWindow.close()
    } finally {
      openingRef.current = false
      setIsOpening(false)
    }
  }

  return (
    <DropdownButtonItem onClick={handleClick} disabled={isOpening}>
      {toolDisplayName}
    </DropdownButtonItem>
  )
}

/** Wrappers for readability */
export const FileExploreToolsOptions = (props: Omit<FileToolOptionsProps, 'kind'>) => (
  <FileToolOptions kind="explore" {...props} />
)

export const FileQueryToolsOptions = (props: Omit<FileToolOptionsProps, 'kind'>) => (
  <FileToolOptions kind="query" {...props} />
)

export const FileConfigureToolsOptions = (props: Omit<FileToolOptionsProps, 'kind'>) => (
  <FileToolOptions kind="configure" {...props} />
)
