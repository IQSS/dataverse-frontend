import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { useDeepCompareMemo } from 'use-deep-compare'
import { useCollection } from '../collection/useCollection'
import { useGetCollectionMetadataBlocksInfo } from './useGetCollectionMetadataBlocksInfo'
import { useGetAllMetadataBlocksInfo } from './useGetAllMetadataBlocksInfo'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useLoading } from '../loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { CollectionFormHelper } from './collection-form/CollectionFormHelper'
import {
  CollectionForm,
  CollectionFormData,
  CollectionFormFacet,
  CollectionFormMetadataBlocks,
  FACET_IDS_FIELD,
  FormattedCollectionInputLevels,
  FormattedCollectionInputLevelsWithoutParentBlockName,
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FACETS_FROM_PARENT,
  USE_FIELDS_FROM_PARENT
} from './collection-form/CollectionForm'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CreateCollectionSkeleton } from './CreateCollectionSkeleton'
import { useGetCollectionFacets } from './useGetCollectionFacets'
import { useGetAllFacetableMetadataFields } from './useGetAllFacetableMetadataFields'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'

interface CreateCollectionProps {
  ownerCollectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function CreateCollection({
  ownerCollectionId,
  collectionRepository,
  metadataBlockInfoRepository
}: CreateCollectionProps) {
  const { t } = useTranslation('createCollection')
  const { isLoading, setIsLoading } = useLoading()
  const { user } = useSession()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    ownerCollectionId
  )

  const {
    collectionUserPermissions,
    isLoading: isLoadingCollectionUserPermissions,
    error: collectionPermissionsError
  } = useGetCollectionUserPermissions({
    collectionIdOrAlias: ownerCollectionId,
    collectionRepository: collectionRepository
  })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)

  // TODO:ME In edit mode, collection id should not be from the collection owner but from the collection being edited, but this can perhaps be differentiated by page.
  const {
    metadataBlocksInfo,
    isLoading: isLoadingMetadataBlocksInfo,
    error: metadataBlockInfoError
  } = useGetCollectionMetadataBlocksInfo({
    collectionId: ownerCollectionId,
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
    collectionId: ownerCollectionId,
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
    isLoadingCollection ||
    isLoadingMetadataBlocksInfo ||
    isLoadingAllMetadataBlocksInfo ||
    isLoadingCollectionFacets ||
    isLoadingFacetableMetadataFields ||
    isLoadingCollectionUserPermissions

  const dataLoadingErrors = [
    collectionPermissionsError,
    metadataBlockInfoError,
    allMetadataBlocksInfoError,
    collectionFacetsError,
    facetableMetadataFieldsError
  ]

  useEffect(() => {
    if (!isLoadingData) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingData, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <PageNotFound />
  }

  if (isLoadingData || !collection) {
    return <CreateCollectionSkeleton />
  }

  if (collectionUserPermissions && !canUserAddCollection) {
    return (
      <div className="pt-4" data-testid="not-allowed-to-create-collection-alert">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToCreateCollection')}
        </Alert>
      </div>
    )
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

  const formDefaultValues: CollectionFormData = {
    hostCollection: collection.name,
    name: user?.displayName ? `${user?.displayName} Collection` : '',
    alias: '',
    type: '',
    contacts: [{ value: user?.email ?? '' }],
    affiliation: user?.affiliation ?? '',
    storage: 'S3',
    description: '',
    [USE_FIELDS_FROM_PARENT]: true,
    [METADATA_BLOCKS_NAMES_GROUPER]: defaultBlocksNames,
    [INPUT_LEVELS_GROUPER]: mergedInputLevels,
    [USE_FACETS_FROM_PARENT]: true,
    [FACET_IDS_FIELD]: defaultCollectionFacets
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection?.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <SeparationLine />
      <RequiredFieldText />

      <CollectionForm
        collectionRepository={collectionRepository}
        ownerCollectionId={ownerCollectionId}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksInfo}
        allFacetableMetadataFields={facetableMetadataFields}
        defaultCollectionFacets={defaultCollectionFacets}
      />
    </section>
  )
}
