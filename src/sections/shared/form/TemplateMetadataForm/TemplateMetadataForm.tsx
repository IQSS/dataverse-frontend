import { useMemo } from 'react'
import { Alert } from '@iqss/dataverse-design-system'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { type MetadataField } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/templates/domain/models/Template'
import { useGetMetadataBlocksInfo } from '../DatasetMetadataForm/useGetMetadataBlocksInfo'
import { MetadataFieldsHelper } from '../DatasetMetadataForm/MetadataFieldsHelper'
import { MetadataFormSkeleton } from '../DatasetMetadataForm/MetadataForm/MetadataFormSkeleton'
import { TemplateForm } from './TemplateForm'

type TemplateMetadataFormProps =
  | {
      mode: 'create'
      collectionId: string
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      templateRepository: TemplateRepository
      template?: never
    }
  | {
      mode: 'edit'
      collectionId: string
      metadataBlockInfoRepository: MetadataBlockInfoRepository
      templateRepository: TemplateRepository
      template: Template
    }

export const TemplateMetadataForm = ({
  mode,
  collectionId,
  metadataBlockInfoRepository,
  templateRepository,
  template
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

  const metadataBlocksInfo = useMemo(() => {
    const normalized = MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(
      metadataBlocksInfoForDisplay
    )

    if (mode === 'edit' && template?.datasetMetadataBlocks) {
      const normalizedTemplateBlocks =
        MetadataFieldsHelper.replaceDatasetMetadataBlocksDotKeysWithSlash(
          template.datasetMetadataBlocks
        )
      return MetadataFieldsHelper.addFieldValuesToMetadataBlocksInfo(
        normalized,
        normalizedTemplateBlocks
      )
    }

    return normalized
  }, [metadataBlocksInfoForDisplay, mode, template])

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
    return <MetadataFormSkeleton onEditMode={mode === 'edit'} />
  }

  if (error) {
    return (
      <Alert variant="danger" dismissible={false}>
        {error}
      </Alert>
    )
  }

  if (mode === 'edit') {
    return (
      <TemplateForm
        mode="edit"
        collectionId={collectionId}
        templateRepository={templateRepository}
        metadataBlocksInfo={metadataBlocksInfo}
        formDefaultValues={formDefaultValues}
        metadataFieldsForMapping={metadataFieldsForMapping}
        template={template}
      />
    )
  }

  return (
    <TemplateForm
      mode="create"
      collectionId={collectionId}
      templateRepository={templateRepository}
      metadataBlocksInfo={metadataBlocksInfo}
      formDefaultValues={formDefaultValues}
      metadataFieldsForMapping={metadataFieldsForMapping}
    />
  )
}
