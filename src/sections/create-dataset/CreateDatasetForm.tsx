import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoading } from '../loading/LoadingContext'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { MetadataBlocksForm } from './MetadataBlocksForm'
import styles from './CreateDatasetForm.module.scss'

interface CreateDatasetFormProps {
  repository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId?: string
}

export function CreateDatasetForm({
  repository,
  metadataBlockInfoRepository,
  collectionId = 'root'
}: CreateDatasetFormProps) {
  const { t } = useTranslation('createDataset')
  const { isLoading, setIsLoading } = useLoading()

  const {
    metadataBlocks,
    isLoading: isLoadingMetadataBlocksToRender,
    error: errorLoadingMetadataBlocksToRender
  } = useGetMetadataBlocksInfo({
    metadataBlockInfoRepository,
    collectionId,
    mode: 'create'
  })

  const formDefaultValues = MetadataFieldsHelper.getFormDefaultValues(metadataBlocks)

  useEffect(() => setIsLoading(false), [isLoading])

  if (isLoadingMetadataBlocksToRender || Object.keys(formDefaultValues).length === 0) {
    {
      /* TODO:ME Add skeleton  */
    }
    {
      /* {isLoadingMetadataBlocksToRender && <MetadataBlocksSkeleton />} */
    }
    return <p>Loading metadatablocks configuration</p>
  }

  return (
    <article>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>
      <SeparationLine />

      <MetadataBlocksForm
        repository={repository}
        metadataBlocks={metadataBlocks}
        formDefaultValues={formDefaultValues}
        errorLoadingMetadataBlocks={errorLoadingMetadataBlocksToRender}
      />
    </article>
  )
}
