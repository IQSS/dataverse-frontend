import { useTranslation } from 'react-i18next'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useGetAvailableDatasetMetadataExportFormats } from '@/info/domain/hooks/useGetAvailableDatasetMetadataExportFormats'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { QueryParamKey } from '@/sections/Route.enum'
import { requireAppConfig } from '@/config'

const appConfig = requireAppConfig()

interface ExportMetadataDropdownProps {
  datasetPersistentId: string
  datasetIsReleased: boolean
  datasetIsDeaccessioned: boolean
  canUpdateDataset: boolean
  anonymizedView: boolean
  dataverseInfoRepository: DataverseInfoRepository
}

export const ExportMetadataDropdown = ({
  datasetPersistentId,
  datasetIsReleased,
  datasetIsDeaccessioned,
  canUpdateDataset,
  anonymizedView,
  dataverseInfoRepository
}: ExportMetadataDropdownProps) => {
  const { t } = useTranslation('shared')
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
    <DropdownButton
      id="export-metadata-dropdown"
      title={t('exportMetadata')}
      size="sm"
      icon={<BoxArrowUpRight className="me-2 mb-1" />}>
      {Object.entries(datasetMetadataExportFormats).map(([key, exportFormat]) => {
        if (!exportFormat.isVisibleInUserInterface) return null

        const href = `${appConfig.backendUrl}/api/datasets/export?exporter=${key}&${
          QueryParamKey.PERSISTENT_ID
        }=${encodeURIComponent(datasetPersistentId)}`

        return (
          <DropdownButtonItem as="a" href={href} target="_blank" key={key}>
            {exportFormat.displayName}
          </DropdownButtonItem>
        )
      })}
    </DropdownButton>
  )
}
