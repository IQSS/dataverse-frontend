import { DATAVERSE_BACKEND_URL } from '@/config'
import { useGetAvailableDatasetMetadataExportFormats } from '@/info/domain/hooks/useGetAvailableDatasetMetadataExportFormats'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { QueryParamKey } from '@/sections/Route.enum'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

interface ExportMetadataDropdownProps {
  datasetPersistentId: string
  datasetIsReleased: boolean
  datasetIsDeaccessioned: boolean
  canUpdateDataset: boolean
  anonymizedView: boolean
  dataverseInfoRepository: DataverseInfoRepository
}

// TODO:ME - Add dropdown in file metadata tab too
// TODO:ME - Add unit tests

export const ExportMetadataDropdown = ({
  datasetPersistentId,
  datasetIsReleased,
  datasetIsDeaccessioned,
  canUpdateDataset,
  anonymizedView,
  dataverseInfoRepository
}: ExportMetadataDropdownProps) => {
  const { datasetMetadataExportFormats, isLoadingExportFormats, errorGetExportFormats } =
    useGetAvailableDatasetMetadataExportFormats({ dataverseInfoRepository })

  const shouldRender =
    datasetIsReleased && (!datasetIsDeaccessioned || canUpdateDataset) && !anonymizedView

  if (!shouldRender) return null

  if (
    isLoadingExportFormats ||
    errorGetExportFormats ||
    !datasetMetadataExportFormats ||
    Object.keys(datasetMetadataExportFormats).length === 0
  ) {
    return null
  }

  return (
    <div className="d-flex justify-content-end mb-3">
      <DropdownButton
        id="export-metadata-dropdown"
        title="Export Metadata"
        size="sm"
        icon={<BoxArrowUpRight className="me-2 mb-1" />}>
        {Object.entries(datasetMetadataExportFormats).map(([key, exportFormat]) => {
          if (!exportFormat.isVisibleInUserInterface) return null

          const href = `${DATAVERSE_BACKEND_URL}/api/datasets/export?exporter=${key}&${
            QueryParamKey.PERSISTENT_ID
          }=${encodeURIComponent(datasetPersistentId)}`

          return (
            <DropdownButtonItem as="a" href={href} target="_blank" key={key}>
              {exportFormat.displayName}
            </DropdownButtonItem>
          )
        })}
      </DropdownButton>
    </div>
  )
}
