import {
  DatasetDownloadUrls,
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadSize, FileDownloadMode } from '../../../../files/domain/models/FileMetadata'
import { Download as DownloadIcon } from 'react-bootstrap-icons'
import { DatasetExploreOptions } from './DatasetExploreOptions'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'

interface AccessDatasetMenuProps {
  version: DatasetVersion
  permissions: DatasetPermissions
  hasOneTabularFileAtLeast: boolean
  fileDownloadSizes: FileDownloadSize[]
  downloadUrls: DatasetDownloadUrls
  fileStore: string | undefined
  persistentId: string
  externalToolsRepository: ExternalToolsRepository
}

export function AccessDatasetMenu({
  version,
  permissions,
  hasOneTabularFileAtLeast,
  fileDownloadSizes,
  downloadUrls,
  fileStore,
  persistentId,
  externalToolsRepository
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

  // TODO: remove this when access datafile supports bearer tokens
  if (version.publishingStatus === DatasetPublishingStatus.DRAFT) {
    return <></>
  }

  return (
    <DropdownButton
      id={`access-dataset-menu`}
      title={t('datasetActionButtons.accessDataset.title')}
      asButtonGroup
      variant="primary">
      <DropdownHeader className="d-flex align-items-center gap-1">
        {t('datasetActionButtons.accessDataset.downloadOptions.header')} <DownloadIcon />
      </DropdownHeader>
      <DatasetDownloadOptions
        hasOneTabularFileAtLeast={hasOneTabularFileAtLeast}
        fileDownloadSizes={fileDownloadSizes}
        downloadUrls={downloadUrls}
      />
      <DatasetExploreOptions
        externalToolsRepository={externalToolsRepository}
        persistentId={persistentId}
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
// TODO: add compute feature
