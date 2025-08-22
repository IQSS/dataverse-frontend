import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { HostCollectionForm } from '../create-dataset/HostCollectionForm/HostCollectionForm'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { DatasetMetadataForm } from '../shared/form/DatasetMetadataForm'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useLoading } from '../loading/LoadingContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { useCollection } from '../collection/useCollection'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { CreateDatasetSkeleton } from '../create-dataset/CreateDatasetSkeleton'

interface CreateReviewProps {
  datasetRepository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionRepository: CollectionRepository
  collectionId: string
}

export function CreateReview({
  datasetRepository,
  metadataBlockInfoRepository,
  collectionRepository,
  collectionId
}: CreateReviewProps) {
  const { t } = useTranslation('createReview')
  const { isModalOpen, hideModal } = useNotImplementedModal()
  const { setIsLoading } = useLoading()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  const { collectionUserPermissions, isLoading: isLoadingCollectionUserPermissions } =
    useGetCollectionUserPermissions({
      collectionIdOrAlias: collectionId,
      collectionRepository: collectionRepository
    })

  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)
  const isLoadingData = isLoadingCollectionUserPermissions || isLoadingCollection

  useEffect(() => {
    setIsLoading(isLoadingData)
  }, [isLoadingData, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingCollection || !collection) {
    return <CreateDatasetSkeleton />
  }

  if (collectionUserPermissions && !canUserAddDataset) {
    return (
      <div className="pt-4" data-testid="not-allowed-to-create-dataset-alert">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToCreateDataset')}
        </Alert>
      </div>
    )
  }

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
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
        <HostCollectionForm collectionId={collection.id} />

        <DatasetMetadataForm
          mode="create"
          collectionId={collectionId}
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      </section>
    </>
  )
}
