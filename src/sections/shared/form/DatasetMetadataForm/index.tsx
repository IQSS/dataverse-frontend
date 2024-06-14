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

  // If we are in edit mode, we need to add the values to the metadata blocks info
  const metadataBlocksInfoWithValues = useMemo(() => {
    if (metadataBlocksInfo.length === 0) return null

    return onEditMode
      ? MetadataFieldsHelper.addFieldValuesToMetadataBlocksInfo(
          metadataBlocksInfo,
          datasetMetadaBlocksCurrentValues
        )
      : null
  }, [metadataBlocksInfo, datasetMetadaBlocksCurrentValues, onEditMode])

  // Set the form default values object based on the metadata blocks info
  const formDefaultValues = useMemo(() => {
    return onEditMode && metadataBlocksInfoWithValues !== null
      ? MetadataFieldsHelper.getFormDefaultValues(metadataBlocksInfoWithValues)
      : MetadataFieldsHelper.getFormDefaultValues(metadataBlocksInfo)
  }, [metadataBlocksInfo, metadataBlocksInfoWithValues, onEditMode])

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
