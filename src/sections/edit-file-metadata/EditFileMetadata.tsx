import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { File } from '@/files/domain/models/File'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { EditFileMetadataSkeleton } from './EditFileMetadataSkeleton'
import {
  EditFileMetadataFormData,
  EditFilesList
} from '@/sections/edit-file-metadata/EditFilesList'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { useFile } from '@/sections/file/useFile'
import styles from './EditFileMetadata.module.scss'

interface EditFileMetadataProps {
  fileId: number
  fileRepository: FileRepository
  referrer: EditFileMetadataReferrer
}

// From where the user is coming from
export enum EditFileMetadataReferrer {
  DATASET = 'dataset',
  FILE = 'file'
}

export const EditFileMetadata = ({ fileId, fileRepository, referrer }: EditFileMetadataProps) => {
  const { t: tEditFileMetadata } = useTranslation('editFileMetadata')
  const { t: tFiles } = useTranslation('files')
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

  const { canEditOwnerDataset } = file.permissions

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={file.hierarchy}
        withActionItem
        actionItemText={tEditFileMetadata('pageTitle')}
      />

      <header>
        <h1>{tEditFileMetadata('pageTitle')}</h1>
      </header>

      {!canEditOwnerDataset ? (
        <div className="pt-4">
          <Alert variant="danger" dismissible={false}>
            {tEditFileMetadata('errorAlert.notAllowedToEditFileMetadata')}
          </Alert>
        </div>
      ) : (
        <Tabs defaultActiveKey="files">
          <Tabs.Tab eventKey="files" title={tFiles('files')}>
            <div className={styles.tab_container}>
              <EditFilesList
                fileRepository={fileRepository}
                editFileMetadataFormData={createEditFileMetadataFormData(file)}
                referrer={referrer}
                datasetPersistentId={file.hierarchy.parent?.persistentId}
              />
            </div>
          </Tabs.Tab>
        </Tabs>
      )}
    </section>
  )
}
const createEditFileMetadataFormData = (file: File): EditFileMetadataFormData => {
  return {
    files: [
      {
        id: file.id,
        fileName: file.name,
        fileType: file.metadata.type.value,
        fileSizeString: file.metadata.size.toString(),
        checksumValue: file.metadata.checksum?.value.toString(),
        checksumAlgorithm: file.metadata.checksum?.algorithm,
        description: file.metadata.description ?? '',
        fileDir: file.metadata.directory ?? ''
      }
    ]
  }
}
