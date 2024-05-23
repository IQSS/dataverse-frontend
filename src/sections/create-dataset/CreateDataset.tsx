import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoading } from '../loading/LoadingContext'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { DatasetForm } from './DatasetForm'
import { DatasetFormSkeleton } from './DatasetFormSkeleton'
import { HostCollectionForm } from './HostCollectionForm/HostCollectionForm'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'

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
  const { isModalOpen, hideModal } = useNotImplementedModal()
  const {
    metadataBlocks,
    isLoading: isLoadingMetadataBlocksConfiguration,
    error: errorLoadingMetadataBlocksToRender
  } = useGetMetadataBlocksInfo({
    metadataBlockInfoRepository,
    collectionId
  })

  const formDefaultValues = MetadataFieldsHelper.getFormDefaultValues(metadataBlocks)

  useEffect(() => {
    if (!isLoadingMetadataBlocksConfiguration) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingMetadataBlocksConfiguration])

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      <article>
        <header>
          <h1>{t('pageTitle')}</h1>
        </header>
        <SeparationLine />
        <HostCollectionForm collectionId={collectionId} />

        {isLoadingMetadataBlocksConfiguration ? (
          <DatasetFormSkeleton />
        ) : (
          <DatasetForm
            repository={repository}
            collectionId={collectionId}
            metadataBlocks={metadataBlocks}
            formDefaultValues={formDefaultValues}
            errorLoadingMetadataBlocks={errorLoadingMetadataBlocksToRender}
          />
        )}
      </article>
    </>
  )
}
