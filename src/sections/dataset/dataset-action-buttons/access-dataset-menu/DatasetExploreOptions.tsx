import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { BarChartFill as BarChartFillIcon } from 'react-bootstrap-icons'
import { DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { getDatasetExternalToolUrl } from '@/externalTools/domain/useCases/GetDatasetExternalToolUrl'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'

interface DatasetExploreOptionsProps {
  externalToolsRepository: ExternalToolsRepository
  persistentId: string
}

export const DatasetExploreOptions = ({
  externalToolsRepository,
  persistentId
}: DatasetExploreOptionsProps) => {
  const { t } = useTranslation('dataset')
  const { datasetExploreTools } = useExternalTools()

  if (datasetExploreTools.length === 0) return null

  return (
    <>
      <DropdownHeader className="d-flex align-items-center gap-1">
        {t('datasetActionButtons.accessDataset.exploreOptions')}
        <BarChartFillIcon />
      </DropdownHeader>
      {datasetExploreTools.map((tool) => (
        <ExploreOption
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

interface ExploreOptionProps {
  toolId: number
  toolDisplayName: string
  persistentId: string
  externalToolsRepository: ExternalToolsRepository
}

const ExploreOption = ({
  toolId,
  toolDisplayName,
  persistentId,
  externalToolsRepository
}: ExploreOptionProps) => {
  const [isOpening, setIsOpening] = useState(false)
  const { t: tShared } = useTranslation('shared')

  const handleClick = async () => {
    // If already opening, do nothing
    if (isOpening) return
    setIsOpening(true)

    const newWindow = window.open('', '_blank')

    // If the window didn't open, likely due to a popup blocker
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      toast.info(tShared('allowPopups'))
      setIsOpening(false)
      newWindow?.close()
      return
    }

    try {
      // Set a temporary title on the new window while fetching the tool URL
      newWindow.document.title = `Loading ${toolDisplayName}...`

      const datasetExternalTool = await getDatasetExternalToolUrl(
        externalToolsRepository,
        persistentId,
        toolId,
        { preview: false, locale: 'en' }
      )
      // Change the location of the new window to the tool URL
      newWindow.location.href = datasetExternalTool.toolUrlResolved
    } catch (error) {
      // If there's an error, notify the user and close the new window
      toast.error(tShared('externalToolOpeningFailed'))
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
