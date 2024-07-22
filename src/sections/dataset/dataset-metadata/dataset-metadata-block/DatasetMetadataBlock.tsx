import { DatasetMetadataBlock as DatasetMetadataBlockModel } from '../../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import { DatasetMetadataFields } from '../dataset-metadata-fields/DatasetMetadataFields'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetMetadataBlockDisplayFormatInfo } from '../../useGetMetadataBlockDisplayFormatInfo'
import { DatasetMetadataBlockSkeleton } from './DatasetMetadataBlockSkeleton'

interface DatasetMetadataBlockProps {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  metadataBlock: DatasetMetadataBlockModel
}

export function DatasetMetadataBlock({
  metadataBlock,
  metadataBlockInfoRepository
}: DatasetMetadataBlockProps) {
  const { t } = useTranslation(metadataBlock.name)
  const {
    metadataBlockDisplayFormatInfo,
    isLoading: isLoadingMetadataBlockDisplayFormatInfo,
    error: errorLoadingMetadataBlockDisplayFormatInfo
  } = useGetMetadataBlockDisplayFormatInfo({
    metadataBlockName: metadataBlock.name,
    metadataBlockInfoRepository
  })

  if (errorLoadingMetadataBlockDisplayFormatInfo) {
    return null
  }

  if (isLoadingMetadataBlockDisplayFormatInfo || !metadataBlockDisplayFormatInfo) {
    return <DatasetMetadataBlockSkeleton />
  }

  return (
    <>
      <Accordion.Header>{t(`${metadataBlock.name}.name`)}</Accordion.Header>
      <Accordion.Body>
        <DatasetMetadataFields
          metadataBlockName={metadataBlock.name}
          metadataFields={metadataBlock.fields}
          metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
        />
      </Accordion.Body>
    </>
  )
}
