import {
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

import { FileDownloadSize, FileDownloadSizeMode } from '../../../../files/domain/models/File'
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

  function getFormattedFileSize(mode: FileDownloadSizeMode): string {
    const foundSize = fileDownloadSizes && fileDownloadSizes.find((size) => size.mode === mode)
    return foundSize ? foundSize.toString() : ''
  }

  const handleDownload = (type: FileDownloadSizeMode) => {
    //TODO: implement download feature
    console.log('downloading file ' + type)
  }

  interface DatasetDownloadOptionsProps {
    datasetContainsTabularFiles: boolean
  }

  const DatasetDownloadOptions = ({ datasetContainsTabularFiles }: DatasetDownloadOptionsProps) => {
    return datasetContainsTabularFiles ? (
      <>
        <DropdownButtonItem onClick={() => handleDownload(FileDownloadSizeMode.ORIGINAL)}>
          {t('datasetActionButtons.accessDataset.downloadOriginalZip')} (
          {getFormattedFileSize(FileDownloadSizeMode.ORIGINAL)})
        </DropdownButtonItem>
        <DropdownButtonItem onClick={() => handleDownload(FileDownloadSizeMode.ARCHIVAL)}>
          {t('datasetActionButtons.accessDataset.downloadArchiveZip')} (
          {getFormattedFileSize(FileDownloadSizeMode.ARCHIVAL)}) )
        </DropdownButtonItem>
      </>
    ) : (
      <DropdownButtonItem onClick={() => handleDownload(FileDownloadSizeMode.ORIGINAL)}>
        {t('datasetActionButtons.accessDataset.downloadZip')} (
        {getFormattedFileSize(FileDownloadSizeMode.ORIGINAL)}) )
      </DropdownButtonItem>
    )
  }

  const { t } = useTranslation('dataset')
  return (
    <DropdownButton
      id={`access-dataset-menu`}
      title={t('datasetActionButtons.accessDataset.title')}
      asButtonGroup
      variant="primary">
      <DropdownHeader>
        Download Options <Download></Download>
      </DropdownHeader>
      <DatasetDownloadOptions datasetContainsTabularFiles={hasOneTabularFileAtLeast} />
    </DropdownButton>
  )
}

// TODO: add download feature https://github.com/IQSS/dataverse-frontend/issues/63
// TODO: add explore feature
// TODO: add compute feature
