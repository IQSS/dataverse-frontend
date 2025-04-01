import { useEffect, useMemo } from 'react'
import { useLoading } from '../../../loading/LoadingContext'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { MetadataFormSkeleton } from './MetadataForm/MetadataFormSkeleton'
import { MetadataForm } from './MetadataForm'
import { DatasetMetadataBlocks } from '../../../../dataset/domain/models/Dataset'
import { Alert } from '@iqss/dataverse-design-system'

type DatasetMetadataFormProps =
  | {
      mode: 'create'
      collectionId: string
      datasetRepository: DatasetRepository
      datasetPersistentID?: never
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      datasetMetadaBlocksCurrentValues?: never
      datasetInternalVersionNumber?: never
    }
  | {
      mode: 'edit'
      collectionId: string
      datasetRepository: DatasetRepository
      datasetPersistentID: string
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      datasetMetadaBlocksCurrentValues: DatasetMetadataBlocks
      datasetInternalVersionNumber: number
    }

export type DatasetMetadataFormMode = 'create' | 'edit'

export const DatasetMetadataForm = ({
  mode,
  collectionId,
  datasetRepository,
  datasetPersistentID,
  metadataBlockInfoRepository,
  datasetMetadaBlocksCurrentValues,
  datasetInternalVersionNumber
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

  // Metadata blocks info with field names that have dots replaced by slashes
  const normalizedMetadataBlocksInfo = useMemo(() => {
    if (metadataBlocksInfo.length === 0) return []

    return MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfo)
  }, [metadataBlocksInfo])

  // Dataset metadata blocks current values properties with dots replaced by slashes to match the metadata blocks info
  const normalizedDatasetMetadaBlocksCurrentValues = useMemo(() => {
    if (!datasetMetadaBlocksCurrentValues) return undefined

    return MetadataFieldsHelper.replaceDatasetMetadataBlocksCurrentValuesDotKeysWithSlash(
      datasetMetadaBlocksCurrentValues
    )
  }, [datasetMetadaBlocksCurrentValues])

  // If we are in edit mode, we need to add the values to the metadata blocks info
  const normalizedMetadataBlocksInfoWithValues = useMemo(() => {
    if (normalizedMetadataBlocksInfo.length === 0 || !normalizedDatasetMetadaBlocksCurrentValues) {
      return null
    }

    return onEditMode
      ? MetadataFieldsHelper.addFieldValuesToMetadataBlocksInfo(
          normalizedMetadataBlocksInfo,
          normalizedDatasetMetadaBlocksCurrentValues
        )
      : null
  }, [normalizedMetadataBlocksInfo, normalizedDatasetMetadaBlocksCurrentValues, onEditMode])

  // Set the form default values object based on the metadata blocks info
  const formDefaultValues = useMemo(() => {
    return onEditMode && normalizedMetadataBlocksInfoWithValues !== null
      ? MetadataFieldsHelper.getFormDefaultValues(normalizedMetadataBlocksInfoWithValues)
      : MetadataFieldsHelper.getFormDefaultValues(normalizedMetadataBlocksInfo)
  }, [normalizedMetadataBlocksInfo, normalizedMetadataBlocksInfoWithValues, onEditMode])

  useEffect(() => {
    setIsLoading(isLoadingMetadataBlocksInfo)
  }, [isLoadingMetadataBlocksInfo, setIsLoading])

  if (isLoadingMetadataBlocksInfo || !formDefaultValues) {
    return <MetadataFormSkeleton onEditMode={mode === 'edit'} />
  }

  if (errorLoadingMetadataBlocksInfo) {
    return (
      <Alert variant="danger" dismissible={false}>
        {errorLoadingMetadataBlocksInfo}
      </Alert>
    )
  }

  return (
    <MetadataForm
      mode={mode}
      collectionId={collectionId}
      formDefaultValues={formDefaultValues}
      metadataBlocksInfo={normalizedMetadataBlocksInfo}
      errorLoadingMetadataBlocksInfo={errorLoadingMetadataBlocksInfo}
      datasetRepository={datasetRepository}
      datasetPersistentID={datasetPersistentID}
      datasetInternalVersionNumber={datasetInternalVersionNumber}
    />
  )
}
