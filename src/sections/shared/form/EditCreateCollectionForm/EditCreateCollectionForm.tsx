import { useEffect } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetCollectionMetadataBlocksInfo } from '@/shared/hooks/useGetCollectionMetadataBlocksInfo'
import { useGetAllMetadataBlocksInfo } from '@/shared/hooks/useGetAllMetadataBlocksInfo'
import { useGetCollectionFacets } from '@/shared/hooks/useGetCollectionFacets'
import { useGetAllFacetableMetadataFields } from '@/shared/hooks/useGetAllFacetableMetadataFields'
import { useLoading } from '@/sections/loading/LoadingContext'
import { useDeepCompareMemo } from 'use-deep-compare'
import { CollectionFormHelper } from './CollectionFormHelper'
import {
  CollectionFormData,
  CollectionFormFacet,
  CollectionFormMetadataBlocks,
  FormattedCollectionInputLevels,
  FormattedCollectionInputLevelsWithoutParentBlockName
} from './types'
import { Collection } from '@/collection/domain/models/Collection'
import { Alert } from '@iqss/dataverse-design-system'
import { User } from '@/users/domain/models/User'
import { CollectionForm } from './collection-form/CollectionForm'
import { EditCreateCollectionFormSkeleton } from './EditCreateCollectionFormSkeleton'

export const METADATA_BLOCKS_NAMES_GROUPER = 'metadataBlockNames'
export const USE_FIELDS_FROM_PARENT = 'useFieldsFromParent'
export const INPUT_LEVELS_GROUPER = 'inputLevels'
export const FACET_IDS_FIELD = 'facetIds'
export const USE_FACETS_FROM_PARENT = 'useFacetsFromParent'

type EditCreateCollectionFormProps =
  | {
      mode: 'create'
      user: User
      collection: Collection
      parentCollectionId: string
      collectionRepository: CollectionRepository
      metadataBlockInfoRepository: MetadataBlockInfoRepository
    }
  | {
      mode: 'edit'
      user: User
      collection: Collection
      parentCollectionId?: never
      collectionRepository: CollectionRepository
      metadataBlockInfoRepository: MetadataBlockInfoRepository
    }

export type EditCreateCollectionFormMode = 'create' | 'edit'

export const EditCreateCollectionForm = ({
  mode,
  user,
  collection,
  parentCollectionId,
  collectionRepository,
  metadataBlockInfoRepository
}: EditCreateCollectionFormProps) => {
  const { setIsLoading } = useLoading()

  const onEditMode = mode === 'edit'

  const {
    metadataBlocksInfo,
    isLoading: isLoadingMetadataBlocksInfo,
    error: metadataBlockInfoError
  } = useGetCollectionMetadataBlocksInfo({
    collectionId: onEditMode ? collection.id : parentCollectionId,
    metadataBlockInfoRepository
  })

  const {
    allMetadataBlocksInfo,
    isLoading: isLoadingAllMetadataBlocksInfo,
    error: allMetadataBlocksInfoError
  } = useGetAllMetadataBlocksInfo({ metadataBlockInfoRepository })

  const {
    collectionFacets,
    isLoading: isLoadingCollectionFacets,
    error: collectionFacetsError
  } = useGetCollectionFacets({
    collectionId: onEditMode ? collection.id : parentCollectionId,
    collectionRepository
  })

  const {
    facetableMetadataFields,
    isLoading: isLoadingFacetableMetadataFields,
    error: facetableMetadataFieldsError
  } = useGetAllFacetableMetadataFields({
    metadataBlockInfoRepository
  })

  const baseInputLevels: FormattedCollectionInputLevels = useDeepCompareMemo(() => {
    return CollectionFormHelper.defineBaseInputLevels(allMetadataBlocksInfo)
  }, [allMetadataBlocksInfo])

  const formattedCollectionInputLevels: FormattedCollectionInputLevelsWithoutParentBlockName =
    useDeepCompareMemo(() => {
      return CollectionFormHelper.formatCollectiontInputLevels(collection?.inputLevels)
    }, [collection?.inputLevels])

  const mergedInputLevels = useDeepCompareMemo(() => {
    return CollectionFormHelper.mergeBaseAndDefaultInputLevels(
      baseInputLevels,
      formattedCollectionInputLevels
    )
  }, [baseInputLevels, formattedCollectionInputLevels])

  const baseBlockNames = useDeepCompareMemo(() => {
    return allMetadataBlocksInfo.reduce((acc, block) => {
      acc[block.name as keyof CollectionFormMetadataBlocks] = false
      return acc
    }, {} as CollectionFormMetadataBlocks)
  }, [allMetadataBlocksInfo])

  const defaultBlocksNames = useDeepCompareMemo(
    () =>
      metadataBlocksInfo
        .map((block) => block.name)
        .reduce((acc, blockName) => {
          acc[blockName as keyof CollectionFormMetadataBlocks] = true
          return acc
        }, baseBlockNames),
    [metadataBlocksInfo, baseBlockNames]
  )

  const defaultCollectionFacets: CollectionFormFacet[] = collectionFacets.map((facet) => ({
    id: facet.name,
    value: facet.name,
    label: facet.displayName
  }))

  const isLoadingData =
    isLoadingMetadataBlocksInfo ||
    isLoadingAllMetadataBlocksInfo ||
    isLoadingCollectionFacets ||
    isLoadingFacetableMetadataFields

  const dataLoadingErrors = [
    metadataBlockInfoError,
    allMetadataBlocksInfoError,
    collectionFacetsError,
    facetableMetadataFieldsError
  ]

  useEffect(() => {
    if (!isLoadingData) {
      setIsLoading(false)
    }
  }, [isLoadingData, setIsLoading])

  if (isLoadingData) {
    return <EditCreateCollectionFormSkeleton />
  }

  if (dataLoadingErrors.some((error) => error !== null)) {
    return (
      <>
        {dataLoadingErrors
          .filter((err) => err !== null)
          .map((error, index) => (
            <Alert key={index} variant="danger" dismissible={false}>
              {error}
            </Alert>
          ))}
      </>
    )
  }

  const defaultCollectionName = onEditMode
    ? collection.name
    : user?.displayName
    ? `${user?.displayName} Collection`
    : ''

  const defaultContacts = onEditMode
    ? CollectionFormHelper.formatCollectionContactsToFormContacts(collection.contacts)
    : [{ value: user?.email ?? '' }]

  const formDefaultValues: CollectionFormData = {
    hostCollection: collection.name,
    name: defaultCollectionName,
    alias: onEditMode ? collection.id : '',
    type: onEditMode ? collection.type : '',
    contacts: defaultContacts,
    affiliation: onEditMode ? collection.affiliation ?? '' : user?.affiliation ?? '',
    storage: 'S3',
    description: onEditMode ? collection.description ?? '' : '',
    [USE_FIELDS_FROM_PARENT]: onEditMode ? collection.isMetadataBlockRoot : true,
    [METADATA_BLOCKS_NAMES_GROUPER]: defaultBlocksNames,
    [INPUT_LEVELS_GROUPER]: mergedInputLevels,
    [USE_FACETS_FROM_PARENT]: onEditMode ? collection.isFacetRoot : true,
    [FACET_IDS_FIELD]: defaultCollectionFacets
  }

  return (
    <CollectionForm
      mode={mode}
      collectionRepository={collectionRepository}
      collectionIdOrParentCollectionId={mode === 'create' ? parentCollectionId : collection.id}
      defaultValues={formDefaultValues}
      allMetadataBlocksInfo={allMetadataBlocksInfo}
      allFacetableMetadataFields={facetableMetadataFields}
      defaultCollectionFacets={defaultCollectionFacets}
    />
  )
}
