import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useGetAvailableDatasetMetadataExportFormats } from '@/info/domain/hooks/useGetAvailableDatasetMetadataExportFormats'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import {
  DatasetNonNumericVersion,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus,
  DatasetVersion
} from '@/dataset/domain/models/Dataset'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { useExportMetadata } from '@/sections/dataset/dataset-metadata/export-metadata-dropdown/useExportMetadata'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetVersionsSummaries } from '@/dataset/domain/useCases/getDatasetVersionsSummaries'
import { DatasetVersionPaginationInfo } from '@/dataset/domain/models/DatasetVersionPaginationInfo'
import {
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'

interface ExportMetadataDropdownProps {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  anonymizedView: boolean
  dataverseInfoRepository: DataverseInfoRepository
}

export const ExportMetadataDropdown = ({
  datasetPersistentId,
  datasetVersion,
  anonymizedView,
  dataverseInfoRepository
}: ExportMetadataDropdownProps) => {
  const { datasetRepository } = useDatasetRepositories()
  const { t } = useTranslation('shared')
  const [shouldRender, setShouldRender] = useState(false)
  const { datasetMetadataExportFormats, isLoadingExportFormats, errorGetExportFormats } =
    useGetAvailableDatasetMetadataExportFormats({ dataverseInfoRepository })
  const { handleExportMetadata } = useExportMetadata({
    datasetPersistentId,
    datasetVersion
  })

  useEffect(() => {
    let isMounted = true
    setShouldRender(false)

    if (anonymizedView) {
      return () => {
        isMounted = false
      }
    }

    void canExportMetadata(datasetRepository, datasetPersistentId, datasetVersion).then(
      (canExportMetadataResult) => {
        if (isMounted) {
          setShouldRender(canExportMetadataResult)
        }
      }
    )

    return () => {
      isMounted = false
    }
  }, [datasetRepository, datasetPersistentId, datasetVersion, anonymizedView])

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

        return (
          <DropdownButtonItem
            as="button"
            type="button"
            onClick={() => handleExportMetadata(key)}
            key={key}>
            {exportFormat.displayName}
          </DropdownButtonItem>
        )
      })}
    </DropdownButton>
  )
}

async function canExportMetadata(
  datasetRepository: DatasetRepository,
  datasetId: number | string,
  datasetVersion: DatasetVersion
): Promise<boolean> {
  // Anyone who can load a draft dataset page already has the backend's implicit permission to
  // view it (unauthorized users get a 404 before this component ever renders), so exporting its
  // metadata should be available to everyone who can see the draft, not just editors.
  if (datasetVersion.publishingStatus === DatasetPublishingStatus.DRAFT) {
    return true
  }

  if (datasetVersion.publishingStatus !== DatasetPublishingStatus.RELEASED) {
    return false
  }

  return isLatestPublishedVersion(datasetRepository, datasetId, datasetVersion.number.toString())
}

async function isLatestPublishedVersion(
  datasetRepository: DatasetRepository,
  datasetId: number | string,
  datasetVersionNumber: string
): Promise<boolean> {
  try {
    const versionSummaries = await getDatasetVersionsSummaries(
      datasetRepository,
      datasetId,
      new DatasetVersionPaginationInfo(1, 10)
    )
    const latestPublishedVersion = versionSummaries.summaries.find((summary) =>
      isPublishedVersionSummary(summary)
    )

    return latestPublishedVersion?.versionNumber === datasetVersionNumber
  } catch {
    return false
  }
}

function isPublishedVersionSummary(summary: DatasetVersionSummaryInfo): boolean {
  return (
    summary.versionNumber !== DatasetNonNumericVersion.DRAFT &&
    summary.versionNumber !== DatasetNonNumericVersionSearchParam.DRAFT &&
    !isDeaccessionedVersionSummary(summary)
  )
}

function isDeaccessionedVersionSummary(summary: DatasetVersionSummaryInfo): boolean {
  return (
    summary.summary === DatasetVersionSummaryStringValues.versionDeaccessioned ||
    (typeof summary.summary === 'object' &&
      summary.summary !== null &&
      'deaccessioned' in summary.summary)
  )
}
