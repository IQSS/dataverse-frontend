import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { useLoading } from '../loading/LoadingContext'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { EditFileMetadataSkeleton } from './EditFileMetadataSkeleton'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { useFile } from '@/sections/file/useFile'
import { useEffect } from 'react'
import {
  EditFileMetadataFormData,
  EditFilesList
} from '@/sections/edit-file-metadata/EditFilesList'
import { File } from '@/files/domain/models/File'
interface EditFileMetadataProps {
  fileId: number
  fileRepository: FileRepository
}

export const EditFileMetadata = ({ fileId, fileRepository }: EditFileMetadataProps) => {
  const { t } = useTranslation('editFileMetadata')
  const { setIsLoading } = useLoading()
  const { file, isLoading } = useFile(fileRepository, fileId)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  if (isLoading) {
    return <EditFileMetadataSkeleton />
  }
  if (!file) {
    return <NotFoundPage dvObjectNotFoundType="file" />
  }

  if (!file.permissions.canEditOwnerDataset) {
    return (
      <div className="pt-4">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToEditFileMetadata')}
        </Alert>
      </div>
    )
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={file?.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <SeparationLine />
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={createEditFileMetadataFormData(file)}
      />
    </section>
  )
}
const createEditFileMetadataFormData = (file: File): EditFileMetadataFormData => {
  console.log('file', file)
  return {
    files: [
      {
        id: file.id,
        name: file.name,
        fileType: file.metadata.type.toDisplayFormat(),
        fileSizeString: file.metadata.size.toString(),
        checksumValue: file.metadata.checksum?.value.toString(),
        checksumAlgorithm: file.metadata.checksum?.algorithm,
        description: file.metadata.description,
        directoryLabel: file.metadata.directory
      }
    ]
  }
}
