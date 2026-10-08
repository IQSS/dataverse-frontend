import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { FileUploader, OperationType } from '../shared/file-uploader/FileUploader'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import styles from './UploadDatasetFiles.module.scss'

interface UploadDatasetFilesProps {
  fileRepository: FileRepository
}

export const UploadDatasetFiles = ({ fileRepository: fileRepository }: UploadDatasetFilesProps) => {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading: isLoadingDataset } = useDataset()
  const { t } = useTranslation('uploadDatasetFiles')
  const { t: tFiles } = useTranslation('files')

  useEffect(() => {
    setIsLoading(isLoadingDataset)
  }, [isLoadingDataset, setIsLoading])

  if (isLoadingDataset) {
    return <AppLoader />
  }

  if (!dataset) {
    return <NotFoundPage dvObjectNotFoundType="dataset" />
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={dataset.hierarchy}
        withActionItem
        actionItemText={t('breadcrumbActionItem')}
      />
      <Tabs defaultActiveKey="files">
        <Tabs.Tab eventKey="files" title={tFiles('files')}>
          <div className={styles.tab_container}>
            <FileUploader
              fileRepository={fileRepository}
              datasetPersistentId={dataset.persistentId}
              storageType="S3"
              operationType={OperationType.ADD_FILES_TO_DATASET}
            />
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
