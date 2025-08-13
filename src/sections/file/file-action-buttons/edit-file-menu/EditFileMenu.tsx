import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { RouteWithParams } from '@/sections/Route.enum'
import { DeleteFileButton } from './delete-file-button/DeleteFileButton'
import { RestrictFileButton } from './restrict-file-button/RestrictFileButton'
import { ReplaceFileReferrer } from '@/sections/replace-file/ReplaceFile'
import { EditFileMetadataReferrer } from '@/sections/edit-file-metadata/EditFileMetadata'

interface EditFileMenuProps {
  fileId: number
  fileRepository: FileRepository
  isRestricted: boolean
  datasetInfo: EditFileMenuDatasetInfo
  storageIdentifier: string | undefined
}

export interface EditFileMenuDatasetInfo {
  persistentId: string
  versionNumber: string
  releasedVersionExists: boolean
  requestAccess?: boolean
  termsOfAccessForRestrictedFiles?: string
}

export const EditFileMenu = ({
  fileId,
  fileRepository,
  datasetInfo,
  isRestricted,
  storageIdentifier
}: EditFileMenuProps) => {
  const { t } = useTranslation('file')

  return (
    <DropdownButton
      id="edit-files-menu"
      title={t('actionButtons.editFileMenu.title')}
      asButtonGroup
      variant="secondary">
      <DropdownButtonItem
        as={Link}
        to={RouteWithParams.EDIT_FILE_METADATA(
          datasetInfo.persistentId,
          datasetInfo.versionNumber,
          fileId,
          EditFileMetadataReferrer.FILE
        )}>
        {t('actionButtons.editFileMenu.options.metadata')}
      </DropdownButtonItem>
      <RestrictFileButton
        fileId={fileId}
        isRestricted={isRestricted}
        fileRepository={fileRepository}
        datasetInfo={datasetInfo}
      />
      {/* TODO: remove this when we can handle non-S3 files */}
      {storageIdentifier?.startsWith('s3') && (
        <DropdownButtonItem
          as={Link}
          to={RouteWithParams.FILES_REPLACE(
            datasetInfo.persistentId,
            datasetInfo.versionNumber,
            fileId,
            ReplaceFileReferrer.FILE
          )}>
          {t('actionButtons.editFileMenu.options.replace')}
        </DropdownButtonItem>
      )}
      <DeleteFileButton fileId={fileId} fileRepository={fileRepository} datasetInfo={datasetInfo} />
    </DropdownButton>
  )
}
