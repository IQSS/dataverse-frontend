import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeepCompareMemo } from 'use-deep-compare'
import { useCollection } from '../collection/useCollection'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useLoading } from '../loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetMetadataBlocksNamesInfo } from './useGetMetadataBlocksNamesInfo'
import {
  CollectionForm,
  CollectionFormData,
  CollectionFormMetadataBlocks,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FIELDS_FROM_ROOT_NAME
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

  const { metadataBlocksNamesInfo, isLoading: isLoadingMetadataBlocksNamesInfo } =
    useGetMetadataBlocksNamesInfo({
      collectionId: ownerCollectionId,
      metadataBlockInfoRepository
    })

  const defaultBlocksNames = useDeepCompareMemo(
    () =>
      metadataBlocksNamesInfo.reduce(
        (acc, blockName) => {
          acc[blockName as keyof CollectionFormMetadataBlocks] = true
          return acc
        },
        {
          citation: false,
          geospatial: false,
          socialscience: false,
          astrophysics: false,
          biomedical: false,
          journal: false
        } as CollectionFormMetadataBlocks
      ),
    [metadataBlocksNamesInfo]
  )

  useEffect(() => {
    if (!isLoadingCollection && !isLoadingMetadataBlocksNamesInfo) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingCollection, isLoadingMetadataBlocksNamesInfo, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <PageNotFound />
  }

  if (isLoadingCollection || isLoadingMetadataBlocksNamesInfo || !collection) {
    return <CreateCollectionSkeleton />
  }
  console.log({ collection, metadataBlocksNamesInfo })
  console.log({ defaultBlocksNames })

  const formDefaultValues: CollectionFormData = {
    hostCollection: collection.name,
    name: user?.displayName ? `${user?.displayName} Collection` : '',
    alias: '',
    type: '',
    contacts: [{ value: user?.email ?? '' }],
    affiliation: user?.affiliation ?? '',
    storage: 'Local (Default)',
    description: '',
    [USE_FIELDS_FROM_ROOT_NAME]: true,
    [METADATA_BLOCKS_NAMES_GROUPER]: defaultBlocksNames
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
      />
    </section>
  )
}
