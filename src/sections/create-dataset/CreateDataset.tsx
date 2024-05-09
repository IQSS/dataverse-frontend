import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoading } from '../loading/LoadingContext'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { DatasetForm } from './DatasetForm'

interface CreateDatasetProps {
  repository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId?: string
}

export function CreateDataset({
  repository,
  metadataBlockInfoRepository,
  collectionId = 'root'
}: CreateDatasetProps) {
  const { t } = useTranslation('createDataset')
  const { isLoading, setIsLoading } = useLoading()

  const {
    metadataBlocks,
    isLoading: isLoadingMetadataBlocksToRender,
    error: errorLoadingMetadataBlocksToRender
  } = useGetMetadataBlocksInfo({
    metadataBlockInfoRepository,
    collectionId,
    mode: 'edit'
  })

  const formDefaultValues = MetadataFieldsHelper.getFormDefaultValues(metadataBlocks)

  useEffect(() => {
    if (!isLoadingMetadataBlocksToRender) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingMetadataBlocksToRender])

  if (isLoadingMetadataBlocksToRender || isLoading) {
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
      <header>
        <h1>{t('pageTitle')}</h1>
      </header>
      <SeparationLine />

      <DatasetForm
        repository={repository}
        metadataBlocks={metadataBlocks}
        formDefaultValues={formDefaultValues}
        errorLoadingMetadataBlocks={errorLoadingMetadataBlocksToRender}
      />
    </article>
  )
}
