import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { useFile } from '../file/useFile'
import { useLoading } from '../loading/LoadingContext'
import { FileInfo } from './file-info/FileInfo'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { FileUploader, OperationType } from '../shared/file-uploader/FileUploader'
import styles from './ReplaceFile.module.scss'

interface ReplaceFileProps {
  fileRepository: FileRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  datasetVersionFromParams: string
}

// TODO:ME - Create the hash with the fixityAlgorithm instead of hardcoded MD5 in the onFileUploadFinished function
// TODO:ME - Maybe is better to receive union type prop mode= 'replace-file' | 'add-files-to-dataset' and handle the use cases inside the component?
// TODO:ME - Add restrict file link from dataset files page ( integrate cheng branch)
// TODO:ME Use the dto mapper before submitting the files
// TODO - We need something to tell the user which files have the same contents as other files already in the dataset.
// TODO:ME - UseEffect in FileUploader with return clean function that cancels all uploads in progress

export const ReplaceFile = ({
  fileRepository,
  fileIdFromParams,
  datasetPidFromParams,
  datasetVersionFromParams
}: ReplaceFileProps) => {
  const { t } = useTranslation('replaceFile')
  const { setIsLoading } = useLoading()

  const { file, isLoading: isLoadingFile } = useFile(
    fileRepository,
    fileIdFromParams,
    datasetVersionFromParams
  )

  // const { handleReplaceFile, newFileID, isReplacingFile } = useReplaceFile(fileRepository)

  useEffect(() => {
    if (!isLoadingFile) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingFile])

  // useEffect(() => {
  //   if (newFileID) {
  //     navigate(
  //       `${Route.FILES}?id=${newFileID}&${QueryParamKey.DATASET_VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
  //     )
  //   }
  // }, [newFileID, navigate, t])

  if (isLoadingFile) {
    return <AppLoader />
  }

  if (!file) {
    return <PageNotFound />
  }

  // const handleSaveChanges = (data: FilesListFormData) => handleReplaceFile(file.id, data.files[0])

  // const uploadedDoneAndHashedFiles = Object.values(fileUploaderState.files).filter(
  //   (file) => file.status === FileUploadStatus.DONE && file.checksumValue
  // )

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
      <FileUploader
        fileRepository={fileRepository}
        datasetPersistentId={datasetPidFromParams}
        storageType="S3"
        operationType={OperationType.REPLACE_FILE}
        originalFile={file}
      />

      {/* <FileUploaderPanel
        fileRepository={fileRepository}
        datasetPersistentId={datasetPidFromParams}
        storageConfiguration="S3"
        originalFile={file}
        onSaveChanges={handleSaveChanges}
        replaceFile={true}
        multiple={false}
        saveSucceeded={newFileID !== null}
        isSaving={isReplacingFile}
      /> */}
    </section>
  )
}
