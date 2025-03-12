import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Col, Row } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { useFile } from '../file/useFile'
import { useReplaceFile } from './useReplaceFile'
import { useLoading } from '../loading/LoadingContext'
import { FileInfo } from './file-info/FileInfo'
import { FileUploaderPanel } from '../shared/file-uploader-panel/FileUploaderPanel'
import { FilesListFormData } from '../shared/file-uploader-panel/uploaded-files-list/UploadedFilesList'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { QueryParamKey, Route } from '../Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import styles from './ReplaceFile.module.scss'

interface ReplaceFileProps {
  fileRepository: FileRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  datasetVersionFromParams: string
}

// TODO:ME - Populate description field with the original file description
// TODO:ME - En replace file que pasa si lo reemplazo por un archivo con different content pero mismo name??
// TODO:ME - Maybe is better to receive union type prop mode= 'replace-file' | 'add-files-to-dataset' and handle the use cases inside the component?
// TODO - We need something to check if the file has the same content as the original file. Easy for replacement, but what about adding new files to a dataset?
// TODO:ME - Add restrict file link from dataset files page ( integrate cheng branch)
// TODO:ME Use the dto mapper before submitting the files

export const ReplaceFile = ({
  fileRepository,
  fileIdFromParams,
  datasetPidFromParams,
  datasetVersionFromParams
}: ReplaceFileProps) => {
  const { t } = useTranslation('replaceFile')
  const { setIsLoading } = useLoading()
  const navigate = useNavigate()

  const { file, isLoading: isLoadingFile } = useFile(
    fileRepository,
    fileIdFromParams,
    datasetVersionFromParams
  )

  const { handleReplaceFile, newFileID, isReplacingFile } = useReplaceFile(fileRepository)

  useEffect(() => {
    if (!isLoadingFile) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingFile])

  useEffect(() => {
    if (newFileID) {
      navigate(
        `${Route.FILES}?id=${newFileID}&${QueryParamKey.DATASET_VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
      )
    }
  }, [newFileID, navigate, t])

  if (isLoadingFile) {
    return <AppLoader />
  }

  if (!file) {
    return <PageNotFound />
  }

  const handleSaveChanges = (data: FilesListFormData) => handleReplaceFile(file.id, data.files[0])

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={file.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <Row className={styles.original_file_info_container}>
        <Col md={2}>
          <span>
            <strong>{t('originalFile')}</strong>
          </span>
        </Col>
        <Col md={10}>
          <FileInfo file={file} />
        </Col>
      </Row>

      <FileUploaderPanel
        fileRepository={fileRepository}
        datasetPersistentId={datasetPidFromParams}
        storageConfiguration="S3"
        originalFile={file}
        onSaveChanges={handleSaveChanges}
        replaceFile={true}
        multiple={false}
        saveSucceeded={newFileID !== null}
        isSaving={isReplacingFile}
      />
    </section>
  )
}
