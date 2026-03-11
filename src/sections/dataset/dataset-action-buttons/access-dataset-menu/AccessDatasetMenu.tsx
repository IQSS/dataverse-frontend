import { useState } from 'react'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { Download as DownloadIcon } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import {
  CustomTerms,
  DatasetDownloadUrls,
  DatasetLicense,
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../dataset/domain/models/Dataset'
import { FileDownloadSize, FileDownloadMode } from '../../../../files/domain/models/FileMetadata'
import { DatasetExploreOptions } from '../DatasetToolsOptions'
import { DownloadWithGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'

// TODO: add compute feature

interface AccessDatasetMenuProps {
  version: DatasetVersion
  permissions: DatasetPermissions
  hasOneTabularFileAtLeast: boolean
  fileDownloadSizes: FileDownloadSize[]
  downloadUrls: DatasetDownloadUrls
  fileStore: string | undefined
  persistentId: string
  guestbookId?: number
  license?: DatasetLicense
  customTerms?: CustomTerms
}

export function AccessDatasetMenu({
  version,
  permissions,
  hasOneTabularFileAtLeast,
  fileDownloadSizes,
  downloadUrls,
  fileStore,
  persistentId,
  guestbookId,
  license,
  customTerms
}: AccessDatasetMenuProps) {
  const { t } = useTranslation('dataset')
  const [showDownloadWithGuestbookModal, setShowDownloadWithGuestbookModal] = useState(false)
  const hasGuestbook = guestbookId !== undefined

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

  const handleDownloadWithGuestbook = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setShowDownloadWithGuestbookModal(true)
  }

  return (
    <>
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
          hasGuestbook={hasGuestbook}
          onDownloadWithGuestbook={handleDownloadWithGuestbook}
        />
        <DatasetExploreOptions persistentId={persistentId} />
      </DropdownButton>
      {hasGuestbook && (
        <DownloadWithGuestbookModal
          show={showDownloadWithGuestbookModal}
          handleClose={() => setShowDownloadWithGuestbookModal(false)}
          guestbookId={guestbookId}
          datasetLicense={license}
          datasetCustomTerms={customTerms}
        />
      )}
    </>
  )
}

interface DatasetDownloadOptionsProps {
  hasOneTabularFileAtLeast: boolean
  fileDownloadSizes: FileDownloadSize[]
  downloadUrls: DatasetDownloadUrls
  hasGuestbook: boolean
  onDownloadWithGuestbook: (event: React.MouseEvent<HTMLElement>) => void
}

const DatasetDownloadOptions = ({
  hasOneTabularFileAtLeast,
  fileDownloadSizes,
  downloadUrls,
  hasGuestbook,
  onDownloadWithGuestbook
}: DatasetDownloadOptionsProps) => {
  const { t } = useTranslation('dataset')
  function getFormattedFileSize(mode: FileDownloadMode): string {
    const foundSize = fileDownloadSizes.find((size) => size.mode === mode)
    return foundSize ? foundSize.toString() : ''
  }

  return hasOneTabularFileAtLeast ? (
    <>
      <DropdownButtonItem
        href={hasGuestbook ? undefined : downloadUrls[FileDownloadMode.ORIGINAL]}
        onClick={hasGuestbook ? onDownloadWithGuestbook : undefined}>
        {t('datasetActionButtons.accessDataset.downloadOptions.originalZip')} (
        {getFormattedFileSize(FileDownloadMode.ORIGINAL)})
      </DropdownButtonItem>
      <DropdownButtonItem
        href={hasGuestbook ? undefined : downloadUrls[FileDownloadMode.ARCHIVAL]}
        onClick={hasGuestbook ? onDownloadWithGuestbook : undefined}>
        {t('datasetActionButtons.accessDataset.downloadOptions.archivalZip')} (
        {getFormattedFileSize(FileDownloadMode.ARCHIVAL)})
      </DropdownButtonItem>
    </>
  ) : (
    <DropdownButtonItem
      href={hasGuestbook ? undefined : downloadUrls[FileDownloadMode.ORIGINAL]}
      onClick={hasGuestbook ? onDownloadWithGuestbook : undefined}>
      {t('datasetActionButtons.accessDataset.downloadOptions.zip')} (
      {getFormattedFileSize(FileDownloadMode.ORIGINAL)})
    </DropdownButtonItem>
  )
}
