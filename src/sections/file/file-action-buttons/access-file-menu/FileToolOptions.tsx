// FileToolOptions.tsx
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { BarChartFill as BarChartFillIcon } from 'react-bootstrap-icons'
import { DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { getFileExternalToolResolved } from '@/externalTools/domain/useCases/GetFileExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'

type ToolKind = 'explore' | 'query'

interface FileToolOptionsProps {
  fileId: number
  kind: ToolKind
  userHasDownloadPermission: boolean
}

const FileToolOptions = ({ fileId, kind, userHasDownloadPermission }: FileToolOptionsProps) => {
  const { t } = useTranslation('shared')
  const { fileExploreTools, fileQueryTools, externalToolsRepository } = useExternalTools()

  const tools = kind === 'explore' ? fileExploreTools : fileQueryTools
  if (!tools || tools.length === 0) return null

  if (!userHasDownloadPermission) return null

  const headerLabel = kind === 'explore' ? t('exploreOptions') : t('queryOptions')

  return (
    <>
      <DropdownHeader className="d-flex align-items-center gap-1">
        {headerLabel}
        <BarChartFillIcon />
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

  const handleClick = async () => {
    // If already opening, do nothing
    if (isOpening) return
    setIsOpening(true)

    // Open a blank window immediately to avoid popup blockers
    const newWindow = window.open('', '_blank')

    // If the window didn't open, likely due to a popup blocker
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      toast.info(t('allowPopups'))
      setIsOpening(false)
      newWindow?.close()
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
export const FileExploreOptions = (props: Omit<FileToolOptionsProps, 'kind'>) => (
  <FileToolOptions kind="explore" {...props} />
)

export const FileQueryOptions = (props: Omit<FileToolOptionsProps, 'kind'>) => (
  <FileToolOptions kind="query" {...props} />
)
