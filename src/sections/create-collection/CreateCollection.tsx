import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeepCompareMemo } from 'use-deep-compare'
import { useCollection } from '../collection/useCollection'
import { useGetCollectionMetadataBlocksInfo } from './useGetCollectionMetadataBlocksInfo'
import { useGetAllMetadataBlocksInfo } from './useGetAllMetadataBlocksInfo'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockName } from '../../dataset/domain/models/Dataset'
import { useLoading } from '../loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { CollectionFormHelper } from './collection-form/CollectionFormHelper'
import {
  CollectionForm,
  CollectionFormData,
  CollectionFormMetadataBlocks,
  FormattedCollectionInputLevels,
  FormattedCollectionInputLevelsWithoutParentBlockName,
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FIELDS_FROM_PARENT
} from './collection-form/CollectionForm'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CreateCollectionSkeleton } from './CreateCollectionSkeleton'

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

  // TODO:ME In edit mode, collection id should not be from the collection owner but from the collection being edited, but this can perhaps be differentiated by page.
  const { metadataBlocksInfo, isLoading: isLoadingMetadataBlocksNamesInfo } =
    useGetCollectionMetadataBlocksInfo({
      collectionId: ownerCollectionId,
      metadataBlockInfoRepository
    })

  const { allMetadataBlocksInfo, isLoading: isLoadingAllMetadataBlocksInfo } =
    useGetAllMetadataBlocksInfo({ metadataBlockInfoRepository })

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

  const defaultBlocksNames = useDeepCompareMemo(
    () =>
      metadataBlocksInfo
        .map((block) => block.name)
        .reduce(
          (acc, blockName) => {
            acc[blockName as keyof CollectionFormMetadataBlocks] = true
            return acc
          },
          {
            [MetadataBlockName.CITATION]: false,
            [MetadataBlockName.GEOSPATIAL]: false,
            [MetadataBlockName.SOCIAL_SCIENCE]: false,
            [MetadataBlockName.ASTROPHYSICS]: false,
            [MetadataBlockName.BIOMEDICAL]: false,
            [MetadataBlockName.JOURNAL]: false
          }
        ),
    [metadataBlocksInfo]
  )

  useEffect(() => {
    if (
      !isLoadingCollection &&
      !isLoadingMetadataBlocksNamesInfo &&
      !isLoadingAllMetadataBlocksInfo
    ) {
      setIsLoading(false)
    }
  }, [
    isLoading,
    isLoadingCollection,
    isLoadingMetadataBlocksNamesInfo,
    isLoadingAllMetadataBlocksInfo,
    setIsLoading
  ])

  if (!isLoadingCollection && !collection) {
    return <PageNotFound />
  }

  if (
    isLoadingCollection ||
    isLoadingMetadataBlocksNamesInfo ||
    isLoadingAllMetadataBlocksInfo ||
    !collection
  ) {
    return <CreateCollectionSkeleton />
  }

  const formDefaultValues: CollectionFormData = {
    hostCollection: collection.name,
    name: user?.displayName ? `${user?.displayName} Collection` : '',
    alias: '',
    type: '',
    contacts: [{ value: user?.email ?? '' }],
    affiliation: user?.affiliation ?? '',
    storage: 'Local (Default)',
    description: '',
    [USE_FIELDS_FROM_PARENT]: true,
    [METADATA_BLOCKS_NAMES_GROUPER]: defaultBlocksNames,
    [INPUT_LEVELS_GROUPER]: mergedInputLevels
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
      />
    </section>
  )
}
