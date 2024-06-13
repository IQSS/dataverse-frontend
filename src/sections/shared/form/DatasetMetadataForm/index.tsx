import { useEffect, useMemo } from 'react'
import { useLoading } from '../../../loading/LoadingContext'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { MetadataFormSkeleton } from './MetadataForm/MetadataFormSkeleton'
import { MetadataForm } from './MetadataForm'
import { DatasetMetadataBlocks } from '../../../../dataset/domain/models/Dataset'

type DatasetMetadataFormProps =
  | {
      mode: 'create'
      collectionId: string
      datasetRepository: DatasetRepository
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      datasetMetadaBlocksCurrentValues?: never
    }
  | {
      mode: 'edit'
      collectionId: string
      datasetRepository: DatasetRepository
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      datasetMetadaBlocksCurrentValues: DatasetMetadataBlocks
    }

export type DatasetMetadataFormMode = 'create' | 'edit'

// TODO:ME Keep both accordions open as in JSF version ?
// TODO:ME Add Save and cancel button on top also but where ? and only on edit mode ?
// TODO:ME After removing form from create-dataset also remove unused translations
export const DatasetMetadataForm = ({
  mode,
  collectionId,
  datasetRepository,
  metadataBlockInfoRepository,
  datasetMetadaBlocksCurrentValues
}: DatasetMetadataFormProps) => {
  const { setIsLoading } = useLoading()
  const onEditMode = mode === 'edit'

  const {
    metadataBlocksInfo,
    isLoading: isLoadingMetadataBlocksInfo,
    error: errorLoadingMetadataBlocksInfo
  } = useGetMetadataBlocksInfo({
    mode,
    collectionId,
    metadataBlockInfoRepository
  })

  console.log({ metadataBlocksInfo, datasetMetadaBlocksCurrentValues })

  //TODO:ME Remove 'as' and only run this if onEditMode
  const withAddedFieldsValues = MetadataFieldsHelper.addFieldValuesToMetadataBlocksInfo(
    metadataBlocksInfo,
    datasetMetadaBlocksCurrentValues as DatasetMetadataBlocks
  )

  console.log({ withAddedFieldsValues })

  const formDefaultValues = useMemo(() => {
    if (metadataBlocksInfo.length === 0) return undefined

    // if (onEditMode) {
    //   return MetadataFieldsHelper.getEditFormDefaultValues(
    //     metadataBlocksInfo,
    //     datasetMetadaBlocksCurrentValues
    //   )
    // }

    return MetadataFieldsHelper.getCreateFormDefaultValues(metadataBlocksInfo)
  }, [metadataBlocksInfo, datasetMetadaBlocksCurrentValues, onEditMode])

  useEffect(() => {
    setIsLoading(isLoadingMetadataBlocksInfo)
  }, [isLoadingMetadataBlocksInfo, setIsLoading])

  if (isLoadingMetadataBlocksInfo || !formDefaultValues) {
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
