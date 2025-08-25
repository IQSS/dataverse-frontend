import { useEffect, useMemo } from 'react'
import { useLoading } from '../../../loading/LoadingContext'
import { useGetMetadataBlocksInfo } from '../DatasetMetadataForm/useGetMetadataBlocksInfo'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataFieldsHelper } from '../DatasetMetadataForm/MetadataFieldsHelper'
import { MetadataFormSkeleton } from '../DatasetMetadataForm/MetadataForm/MetadataFormSkeleton'
import { MetadataForm } from '../DatasetMetadataForm/MetadataForm'
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
    metadataBlocksInfo: metatadaBlocksInfo2,
    isLoading: isLoadingMetadataBlocksInfo,
    error: errorLoadingMetadataBlocksInfo
  } = useGetMetadataBlocksInfo({
    mode,
    collectionId,
    metadataBlockInfoRepository
  })

  const researchTypeValues = ['Audiovisual', 'Award', 'Book', 'Book Chapter', 'Collection']

  const ratingValues = ['Low', 'Medium', 'High']

  const reviewBlock = {
    id: 15,
    name: 'review',
    displayName: 'Review Metadata',
    displayOnCreate: true,
    metadataFields: {
      reviewTarget: {
        name: 'reviewTarget',
        displayName: 'Review Target',
        title: 'Review Target',
        type: 'SELECT',
        watermark: '',
        description: 'The type of research object reviewed',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        isAdvancedSearchFieldType: true,
        displayOrder: 0,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        controlledVocabularyValues: researchTypeValues
      },
      authorAndProvenance: {
        name: 'authorAndProvenance',
        displayName: 'Author and Provenance',
        title: 'Author and Provenance',
        type: 'TEXT',
        watermark: '',
        description: 'The level of trust in the data creators and in other provenance information',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '- #VALUE:',
        isRequired: true,
        isAdvancedSearchFieldType: true,
        displayOrder: 1,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        controlledVocabularyValues: ratingValues
      },
      integrityAndUsability: {
        name: 'integrityAndUsability',
        displayName: 'Integrity and Usability',
        title: 'Integrity and Usability',
        type: 'TEXT',
        watermark: '',
        description:
          'The level of trust in the accuracy, completeness, and ease of use of the data',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '- #VALUE:',
        isRequired: true,
        isAdvancedSearchFieldType: true,
        displayOrder: 2,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        controlledVocabularyValues: ratingValues
      },
      fitnessForScope: {
        name: 'fitnessForScope',
        displayName: 'Fitness for Scope and Contextual Relevance',
        title: 'Fitness for Scope',
        type: 'TEXT',
        watermark: '',
        description:
          'The level of trust in the suitability of the data for specific contexts, questions, or policy applications',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '- #VALUE:',
        isRequired: true,
        isAdvancedSearchFieldType: true,
        displayOrder: 3,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        controlledVocabularyValues: ratingValues
      },
      licensingAndLegalClarity: {
        name: 'licensingAndLegalClarity',
        displayName: 'Licensing and Legal Clarity',
        title: 'Licensing and Legal Clarity',
        type: 'TEXT',
        watermark: '',
        description:
          'The level of trust in the explicitness of the data’s usage rights and their compliance with relevant laws and regulations',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '- #VALUE:',
        isRequired: true,
        isAdvancedSearchFieldType: true,
        displayOrder: 4,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        controlledVocabularyValues: ratingValues
      },
      transparencyOfMethodsAndDocumentation: {
        name: 'transparencyOfMethodsAndDocumentation',
        displayName: 'Transparency of Methods and Documentation',
        title: 'Transparency of Methods and Documentation',
        type: 'TEXT',
        watermark: '',
        description:
          'The level of trust in the clarity of the descriptions of data collection and processing methods',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '- #VALUE:',
        isRequired: true,
        isAdvancedSearchFieldType: true,
        displayOrder: 5,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        controlledVocabularyValues: ratingValues
      },
      biasEquityAndRepresentativiness: {
        name: 'biasEquityAndRepresentativiness',
        displayName: 'Bias, Equity, and Representativeness',
        title: 'Bias, Equity, and Representativeness',
        type: 'TEXT',
        watermark: '',
        description:
          'The level of trust in the inclusivity and fairness of the coverage of the data',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '- #VALUE:',
        isRequired: true,
        isAdvancedSearchFieldType: true,
        displayOrder: 6,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        controlledVocabularyValues: ratingValues
      }
    }
  }
  const metadataBlocksInfo = [reviewBlock, ...metatadaBlocksInfo2]
  console.log(metadataBlocksInfo)

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
