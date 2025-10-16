import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { BarChartFill as BarChartFillIcon, GearFill } from 'react-bootstrap-icons'
import { DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { getDatasetExternalToolResolved } from '@/externalTools/domain/useCases/GetDatasetExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'

type ToolKind = 'explore' | 'configure'

interface DatasetToolOptionsProps {
  persistentId: string
  kind: ToolKind
}

const DatasetToolOptions = ({ persistentId, kind }: DatasetToolOptionsProps) => {
  const { t } = useTranslation('shared')
  const { datasetExploreTools, datasetConfigureTools, externalToolsRepository } = useExternalTools()

  const tools = kind === 'explore' ? datasetExploreTools : datasetConfigureTools
  if (!tools || tools.length === 0) return null

  const headerLabel = kind === 'explore' ? t('exploreOptions') : t('configureOptions')
  const icon = kind === 'explore' ? <BarChartFillIcon /> : <GearFill />

  return (
    <>
      <DropdownHeader className="d-flex align-items-center gap-1">
        {headerLabel}
        {icon}
      </DropdownHeader>

      {tools.map((tool) => (
        <ToolOption
          toolId={tool.id}
          toolDisplayName={tool.displayName}
          externalToolsRepository={externalToolsRepository}
          persistentId={persistentId}
          key={tool.id}
        />
      ))}
    </>
  )
}

interface ToolOptionProps {
  toolId: number
  toolDisplayName: string
  persistentId: string
  externalToolsRepository: ExternalToolsRepository
}

const ToolOption = ({
  toolId,
  toolDisplayName,
  persistentId,
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

      const datasetExternalTool = await getDatasetExternalToolResolved(
        externalToolsRepository,
        persistentId,
        toolId,
        { preview: false, locale: i18n.language }
      )

      // Change the location of the new window to the tool URL
      newWindow.location.href = datasetExternalTool.toolUrlResolved
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
export const DatasetExploreOptions = (props: Omit<DatasetToolOptionsProps, 'kind'>) => (
  <DatasetToolOptions kind="explore" {...props} />
)

export const DatasetConfigureOptions = (props: Omit<DatasetToolOptionsProps, 'kind'>) => (
  <DatasetToolOptions kind="configure" {...props} />
)
