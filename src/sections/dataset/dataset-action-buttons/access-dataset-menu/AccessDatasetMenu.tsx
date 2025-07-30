import {
  DatasetDownloadUrls,
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadSize, FileDownloadMode } from '../../../../files/domain/models/FileMetadata'
import { Download } from 'react-bootstrap-icons'

interface AccessDatasetMenuProps {
  version: DatasetVersion
  permissions: DatasetPermissions
  hasOneTabularFileAtLeast: boolean
  fileDownloadSizes: FileDownloadSize[]
  downloadUrls: DatasetDownloadUrls
  fileStore: string | undefined
}

export function AccessDatasetMenu({
  version,
  permissions,
  hasOneTabularFileAtLeast,
  fileDownloadSizes,
  downloadUrls,
  fileStore
}: AccessDatasetMenuProps) {
  const { t } = useTranslation('dataset')

  const flesToDownloadSizeIsZero =
    fileDownloadSizes.map(({ value }) => value).reduce((acc, curr) => acc + curr, 0) === 0

  if (
    flesToDownloadSizeIsZero ||
    !permissions.canDownloadFiles ||
    (version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED &&
      !permissions.canUpdateDataset)
  ) {
    return <></>
  }

  // TODO: remove this when we can handle non-S3 files
  if (!fileStore?.startsWith('s3')) {
    return <></>
  }

  return (
    <DropdownButton
      id={`access-dataset-menu`}
      title={t('datasetActionButtons.accessDataset.title')}
      asButtonGroup
      variant="primary">
      <DropdownHeader>
        {t('datasetActionButtons.accessDataset.downloadOptions.header')} <Download></Download>
      </DropdownHeader>
      <DatasetDownloadOptions
        hasOneTabularFileAtLeast={hasOneTabularFileAtLeast}
        fileDownloadSizes={fileDownloadSizes}
        downloadUrls={downloadUrls}
      />
    </DropdownButton>
  )
}

interface DatasetDownloadOptionsProps {
  hasOneTabularFileAtLeast: boolean
  fileDownloadSizes: FileDownloadSize[]
  downloadUrls: DatasetDownloadUrls
}

const DatasetDownloadOptions = ({
  hasOneTabularFileAtLeast,
  fileDownloadSizes,
  downloadUrls
}: DatasetDownloadOptionsProps) => {
  const { t } = useTranslation('dataset')
  function getFormattedFileSize(mode: FileDownloadMode): string {
    const foundSize = fileDownloadSizes.find((size) => size.mode === mode)
    return foundSize ? foundSize.toString() : ''
  }

  return hasOneTabularFileAtLeast ? (
    <>
      <DropdownButtonItem href={downloadUrls[FileDownloadMode.ORIGINAL]}>
        {t('datasetActionButtons.accessDataset.downloadOptions.originalZip')} (
        {getFormattedFileSize(FileDownloadMode.ORIGINAL)})
      </DropdownButtonItem>
      <DropdownButtonItem href={downloadUrls[FileDownloadMode.ARCHIVAL]}>
        {t('datasetActionButtons.accessDataset.downloadOptions.archivalZip')} (
        {getFormattedFileSize(FileDownloadMode.ARCHIVAL)})
      </DropdownButtonItem>
    </>
  ) : (
    <DropdownButtonItem href={downloadUrls[FileDownloadMode.ORIGINAL]}>
      {t('datasetActionButtons.accessDataset.downloadOptions.zip')} (
      {getFormattedFileSize(FileDownloadMode.ORIGINAL)})
    </DropdownButtonItem>
  )
}

// TODO: add download feature https://github.com/IQSS/dataverse-frontend/issues/63
// TODO: add explore feature
// TODO: add compute feature
