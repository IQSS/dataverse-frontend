import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFile } from '../file/useFile'
import { useLoading } from '../loading/LoadingContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileUploader } from '../shared/file-uploader/FileUploader'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { PageNotFound } from '../page-not-found/PageNotFound'

interface ReplaceFileProps {
  fileRepository: FileRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  datasetVersionFromParams: string
  referrer: ReferrerType
}

export type ReferrerType = 'FILE' | 'DATASET'

export const ReplaceFile = ({
  fileRepository,
  fileIdFromParams,
  datasetPidFromParams,
  datasetVersionFromParams,
  referrer
}: ReplaceFileProps) => {
  const { t } = useTranslation('replaceFile')
  const { setIsLoading } = useLoading()
  const { file, isLoading: isLoadingFile } = useFile(
    fileRepository,
    fileIdFromParams,
    datasetVersionFromParams
  )

  useEffect(() => {
    if (!isLoadingFile) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingFile])

  if (isLoadingFile) {
    return <AppLoader />
  }

  if (!file) {
    return <PageNotFound />
  }

  const handleUploadedFiles = (files: File[]) => {
    console.group('Uploaded files from callback')
    console.log(files)
    console.groupEnd()
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={file.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <FileUploader
        fileRepository={fileRepository}
        datasetPersistentId={datasetPidFromParams}
        onUploadedFiles={handleUploadedFiles}
        storageConfiguration="S3"
        multiple={false}
      />
    </section>
  )
}
