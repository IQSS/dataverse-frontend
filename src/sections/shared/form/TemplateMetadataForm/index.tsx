import { useMemo } from 'react'
import { Alert } from '@iqss/dataverse-design-system'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { type MetadataField } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useGetMetadataBlocksInfo } from '../DatasetMetadataForm/useGetMetadataBlocksInfo'
import { MetadataFieldsHelper } from '../DatasetMetadataForm/MetadataFieldsHelper'
import { MetadataFormSkeleton } from '../DatasetMetadataForm/MetadataForm/MetadataFormSkeleton'
import { TemplateForm } from './TemplateForm'

interface TemplateMetadataFormProps {
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  templateRepository: TemplateRepository
}

export const TemplateMetadataForm = ({
  collectionId,
  metadataBlockInfoRepository,
  templateRepository
}: TemplateMetadataFormProps) => {
  const {
    metadataBlocksInfo: metadataBlocksInfoForDisplay,
    isLoading,
    error
  } = useGetMetadataBlocksInfo({
    mode: 'edit',
    collectionId,
    metadataBlockInfoRepository
  })

  const metadataBlocksInfo = useMemo(
    () =>
      MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(
        metadataBlocksInfoForDisplay
      ),
    [metadataBlocksInfoForDisplay]
  )

  const metadataFieldsForMapping = useMemo(
    () =>
      metadataBlocksInfoForDisplay.reduce<Record<string, Record<string, MetadataField>>>(
        (acc, block) => {
          acc[block.name] = block.metadataFields ?? {}
          return acc
        },
        {}
      ),
    [metadataBlocksInfoForDisplay]
  )

  const formDefaultValues = useMemo(
    () => MetadataFieldsHelper.getFormDefaultValues(metadataBlocksInfo),
    [metadataBlocksInfo]
  )

  if (isLoading) {
    return <MetadataFormSkeleton onEditMode={false} />
  }

  if (error) {
    return (
      <Alert variant="danger" dismissible={false}>
        {error}
      </Alert>
    )
  }

  return (
    <TemplateForm
      collectionId={collectionId}
      templateRepository={templateRepository}
      metadataBlocksInfo={metadataBlocksInfo}
      formDefaultValues={formDefaultValues}
      metadataFieldsForMapping={metadataFieldsForMapping}
    />
  )
}
