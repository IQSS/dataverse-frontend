import { useEffect } from 'react'
import { useLoading } from '../../../loading/LoadingContext'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { MetadataFormSkeleton } from './MetadataForm/MetadataFormSkeleton'
import { MetadataForm } from './MetadataForm'

type DatasetMetadataFormProps = {
  mode: DatasetMetadataFormMode
  collectionId: string
  datasetRepository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export type DatasetMetadataFormMode = 'create' | 'edit'

// TODO:ME Keep both accordions open as in JSF version ?
// TODO:ME Add Save and cancel button on top also but where ? and only on edit mode ?
// TODO:ME After removing form from create-dataset also remove unused translations
export const DatasetMetadataForm = ({
  mode,
  collectionId,
  datasetRepository,
  metadataBlockInfoRepository
}: DatasetMetadataFormProps) => {
  const { setIsLoading } = useLoading()

  const {
    metadataBlocksInfo,
    isLoading: isLoadingMetadataBlocksInfo,
    error: errorLoadingMetadataBlocksInfo
  } = useGetMetadataBlocksInfo({
    mode,
    collectionId,
    metadataBlockInfoRepository
  })

  const formDefaultValues = MetadataFieldsHelper.getFormDefaultValues(metadataBlocksInfo)

  useEffect(() => {
    setIsLoading(isLoadingMetadataBlocksInfo)
  }, [isLoadingMetadataBlocksInfo, setIsLoading])

  if (isLoadingMetadataBlocksInfo) {
    return <MetadataFormSkeleton />
  }

  return (
    <MetadataForm
      mode={mode}
      collectionId={collectionId}
      formDefaultValues={formDefaultValues}
      metadataBlocksInfo={metadataBlocksInfo}
      errorLoadingMetadataBlocksInfo={errorLoadingMetadataBlocksInfo}
      datasetRepository={datasetRepository}
    />
  )
}
