import { useTranslation } from 'react-i18next'
import { useFile } from '../file/useFile'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileUploader } from '../shared/file-uploader/FileUploader'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { useGetDataset } from '../dataset/useGetDataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface ReplaceFileProps {
  fileRepository: FileRepository
  datasetRepository: DatasetRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  datasetVersionFromParams: string
  referrer: ReferrerType
}

export type ReferrerType = 'FILE' | 'DATASET'

export const ReplaceFile = ({
  fileRepository,
  datasetRepository,
  fileIdFromParams,
  datasetPidFromParams,
  datasetVersionFromParams,
  referrer
}: ReplaceFileProps) => {
  const { t } = useTranslation('replaceFile')
  const { file, isLoading: isLoadingFile } = useFile(
    fileRepository,
    fileIdFromParams,
    datasetVersionFromParams
  )
  // TODO:ME - Maybe we dont need this, in case dont, leave the hook just in case for future use, but remove the needed props for this.
  const { dataset, isLoadingDataset, errorLoadingDataset } = useGetDataset({
    datasetRepository,
    persistentId: datasetPidFromParams,
    version: datasetVersionFromParams
  })
  console.log({
    fileRepository,
    fileIdFromParams,
    datasetPidFromParams,
    datasetVersionFromParams,
    referrer
  })

  if (isLoadingFile || isLoadingDataset) {
    return <AppLoader />
  }

  if (!file || !dataset || errorLoadingDataset) {
    return <PageNotFound />
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={file.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <FileUploader storageConfiguration="S3" />
    </section>
  )
}
