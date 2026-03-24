import { useState } from 'react'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { Download as DownloadIcon } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
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
import { downloadFromSignedUrl, requestSignedDownloadUrl } from '@/shared/helpers/DownloadHelper'

// TODO: add compute feature

interface AccessDatasetMenuProps {
  datasetNumericId?: number | string
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
  datasetNumericId,
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
          datasetId={datasetNumericId} // TODO: we should allow this to pass persistentId when we have the backend support for guestbook submission with persistentId
          datasetPersistentId={persistentId}
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
  const { t: tFiles } = useTranslation('files')

  const handleDirectDownload = (
    event: React.MouseEvent<HTMLElement>,
    url: string | undefined
  ): void => {
    if (hasGuestbook) {
      onDownloadWithGuestbook(event)
      return
    }

    if (!url) {
      return
    }

    event.preventDefault()
    void requestSignedDownloadUrl(url)
      .then(downloadFromSignedUrl)
      .catch(() => {
        toast.error(tFiles('actions.optionsMenu.guestbookCollectModal.downloadError'))
      })
  }

  function getFormattedFileSize(mode: FileDownloadMode): string {
    const foundSize = fileDownloadSizes.find((size) => size.mode === mode)
    return foundSize ? foundSize.toString() : ''
  }

  return hasOneTabularFileAtLeast ? (
    <>
      <DropdownButtonItem
        onClick={(event) => handleDirectDownload(event, downloadUrls[FileDownloadMode.ORIGINAL])}>
        {t('datasetActionButtons.accessDataset.downloadOptions.originalZip')} (
        {getFormattedFileSize(FileDownloadMode.ORIGINAL)})
      </DropdownButtonItem>
      <DropdownButtonItem
        onClick={(event) => handleDirectDownload(event, downloadUrls[FileDownloadMode.ARCHIVAL])}>
        {t('datasetActionButtons.accessDataset.downloadOptions.archivalZip')} (
        {getFormattedFileSize(FileDownloadMode.ARCHIVAL)})
      </DropdownButtonItem>
    </>
  ) : (
    <DropdownButtonItem
      onClick={(event) => handleDirectDownload(event, downloadUrls[FileDownloadMode.ORIGINAL])}>
      {t('datasetActionButtons.accessDataset.downloadOptions.zip')} (
      {getFormattedFileSize(FileDownloadMode.ORIGINAL)})
    </DropdownButtonItem>
  )
}
