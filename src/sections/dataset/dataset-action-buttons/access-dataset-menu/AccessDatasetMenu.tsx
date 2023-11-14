import {
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion,
  FileDownloadSize,
  FileDownloadSizeMode
} from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { Download } from 'react-bootstrap-icons'

interface AccessDatasetMenuProps {
  version: DatasetVersion
  permissions: DatasetPermissions
  hasOneTabularFileAtLeast: boolean
  fileDownloadSizes?: FileDownloadSize[]
}

export function AccessDatasetMenu({
  version,
  permissions,
  hasOneTabularFileAtLeast,
  fileDownloadSizes
}: AccessDatasetMenuProps) {
  if (
    !permissions.canDownloadFiles ||
    (version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED &&
      !permissions.canUpdateDataset)
  ) {
    return <></>
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    } else {
      return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
    }
  }

  const handleDownload = (type: FileDownloadSizeMode) => {
    //TODO: implement download feature
    console.log(`Downloading ${type} zip file`)
  }
  const renderDownloadOptions = (datasetContainsTabularFiles: boolean) => {
    // Define the options based on whether the dataset contains tabular files
    const downloadOptions: {
      key: string
      downloadType: FileDownloadSizeMode
      translationKey: string
    }[] = datasetContainsTabularFiles
      ? [
          {
            key: 'original',
            downloadType: FileDownloadSizeMode.ORIGINAL,
            translationKey: 'datasetActionButtons.accessDataset.downloadOriginalZip'
          },
          {
            key: 'archive',
            downloadType: FileDownloadSizeMode.ARCHIVAL,
            translationKey: 'datasetActionButtons.accessDataset.downloadArchiveZip'
          }
        ]
      : [
          {
            key: 'standard',
            downloadType: FileDownloadSizeMode.ORIGINAL,
            translationKey: 'datasetActionButtons.accessDataset.downloadZip'
          }
        ]

    // Map the options to DropdownButtonItem components
    return (
      <>
        <DropdownHeader>
          Download Options <Download></Download>
        </DropdownHeader>
        {downloadOptions.map((option) => (
          <DropdownButtonItem key={option.key} onClick={() => handleDownload(option.downloadType)}>
            {t(option.translationKey)} (
            {formatFileSize(
              fileDownloadSizes?.find((size) => size.fileDownloadSizeMode === option.downloadType)
                ?.size || 0
            )}
            )
          </DropdownButtonItem>
        ))}
      </>
    )
  }

  const { t } = useTranslation('dataset')
  return (
    <DropdownButton
      id={`access-dataset-menu`}
      title={t('datasetActionButtons.accessDataset.title')}
      asButtonGroup
      variant="primary">
      {renderDownloadOptions(hasOneTabularFileAtLeast)}
    </DropdownButton>
  )
}

// TODO: add download feature https://github.com/IQSS/dataverse-frontend/issues/63
// TODO: add explore feature
// TODO: add compute feature
