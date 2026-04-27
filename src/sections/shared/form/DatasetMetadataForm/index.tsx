import { useEffect } from 'react'
import { useLoading } from '../../../../shared/contexts/loading/LoadingContext'
import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { MetadataFormSkeleton } from './MetadataForm/MetadataFormSkeleton'
import { MetadataForm } from './MetadataForm'
import { DatasetMetadataBlocks } from '../../../../dataset/domain/models/Dataset'
import { Alert } from '@iqss/dataverse-design-system'
import { Template } from '@/templates/domain/models/Template'

type DatasetMetadataFormProps =
  | {
      mode: 'create'
      collectionId: string
      datasetRepository: DatasetRepository
      datasetPersistentID?: never
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      datasetMetadaBlocksCurrentValues?: never
      datasetLastUpdateTime?: never
      datasetTemplate?: Template
    }
  | {
      mode: 'edit'
      collectionId: string
      datasetRepository: DatasetRepository
      datasetPersistentID: string
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      datasetMetadaBlocksCurrentValues: DatasetMetadataBlocks
      datasetLastUpdateTime?: string
      datasetTemplate?: never
    }

export type DatasetMetadataFormMode = 'create' | 'edit'

export const DatasetMetadataForm = ({
  mode,
  collectionId,
  datasetRepository,
  datasetPersistentID,
  metadataBlockInfoRepository,
  datasetMetadaBlocksCurrentValues,
  datasetLastUpdateTime,
  datasetTemplate
}: DatasetMetadataFormProps) => {
  const { setIsLoading } = useLoading()

  const {
    metadataBlocksInfo: metadataBlocksInfoForDisplayOnCreate,
    isLoading: isLoadingMetadataBlocksInfoForDisplayOnCreate,
    error: errorLoadingMetadataBlocksInfoForDisplayOnCreate
  } = useGetMetadataBlocksInfo({
    mode: 'create',
    collectionId,
    metadataBlockInfoRepository
  })

  const {
    metadataBlocksInfo: metadataBlocksInfoForDisplayOnEdit,
    isLoading: isLoadingMetadataBlocksInfoForDisplayOnEdit,
    error: errorLoadingMetadataBlocksInfoForDisplayOnEdit
  } = useGetMetadataBlocksInfo({
    mode: 'edit',
    collectionId,
    metadataBlockInfoRepository
  })

  const isLoadingData =
    isLoadingMetadataBlocksInfoForDisplayOnCreate || isLoadingMetadataBlocksInfoForDisplayOnEdit

  const errorLoadingData =
    errorLoadingMetadataBlocksInfoForDisplayOnCreate ||
    errorLoadingMetadataBlocksInfoForDisplayOnEdit

  useEffect(() => {
    setIsLoading(isLoadingData)
  }, [isLoadingData, setIsLoading])

  if (isLoadingData) {
    return <MetadataFormSkeleton onEditMode={mode === 'edit'} />
  }

  if (errorLoadingData) {
    return (
      <Alert variant="danger" dismissible={false}>
        {errorLoadingData}
      </Alert>
    )
  }

  const metadataBlocksInfo = MetadataFieldsHelper.defineMetadataBlockInfo(
    mode,
    metadataBlocksInfoForDisplayOnCreate,
    metadataBlocksInfoForDisplayOnEdit,
    datasetMetadaBlocksCurrentValues,
    datasetTemplate?.datasetMetadataBlocks
  )

  const formDefaultValues = MetadataFieldsHelper.getFormDefaultValues(metadataBlocksInfo)

  return (
    <MetadataForm
      mode={mode}
      collectionId={collectionId}
      formDefaultValues={formDefaultValues}
      metadataBlocksInfo={metadataBlocksInfo}
      datasetRepository={datasetRepository}
      datasetPersistentID={datasetPersistentID}
      datasetLastUpdateTime={datasetLastUpdateTime}
      datasetTemplateInstructions={datasetTemplate?.instructions}
    />
  )
}
