import {
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { Download } from 'react-bootstrap-icons'

interface AccessDatasetMenuProps {
  version: DatasetVersion
  permissions: DatasetPermissions
  datasetContainsTabularFiles?: boolean //TODO: get this from backend
  fileSize?: string //TODO: get file size from backend
}

export function AccessDatasetMenu({
  version,
  permissions,
  datasetContainsTabularFiles = true, //TODO: remove default when backend is ready
  fileSize = '1.2 GB' //TODO: remove default when backend is ready
}: AccessDatasetMenuProps) {
  if (
    !permissions.canDownloadFiles ||
    (version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED &&
      !permissions.canUpdateDataset)
  ) {
    return <></>
  }
  type DownloadType = 'original' | 'archive'

  const handleDownload = (type: DownloadType) => {
    //TODO: implement download feature
    console.log(`Downloading ${type} zip file`)
  }
  const renderDownloadOptions = (datasetContainsTabularFiles: boolean) => {
    // Define the options based on whether the dataset contains tabular files
    const downloadOptions: { key: string; downloadType: DownloadType; translationKey: string }[] =
      datasetContainsTabularFiles
        ? [
            {
              key: 'original',
              downloadType: 'original',
              translationKey: 'datasetActionButtons.accessDataset.downloadOriginalZip'
            },
            {
              key: 'archive',
              downloadType: 'archive',
              translationKey: 'datasetActionButtons.accessDataset.downloadArchiveZip'
            }
          ]
        : [
            {
              key: 'standard',
              downloadType: 'original',
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
            {t(option.translationKey)} ({fileSize})
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
      {renderDownloadOptions(datasetContainsTabularFiles)}
    </DropdownButton>
  )
}

// TODO: add download feature https://github.com/IQSS/dataverse-frontend/issues/63
// TODO: add explore feature
// TODO: add compute feature
