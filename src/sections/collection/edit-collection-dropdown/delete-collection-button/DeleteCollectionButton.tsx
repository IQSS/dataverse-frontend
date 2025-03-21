import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { ConfirmDeleteCollectionModal } from './confirm-delete-collection-modal/ConfirmDeleteCollectionModal'
import { useDeleteCollection } from './useDeleteCollection'
import { UpwardHierarchyNode } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { RouteWithParams } from '@/sections/Route.enum'

interface DeleteCollectionButtonProps {
  collectionId: string
  parentCollection: UpwardHierarchyNode | undefined
  collectionRepository: CollectionRepository
}

export const DeleteCollectionButton = ({
  collectionId,
  parentCollection,
  collectionRepository
}: DeleteCollectionButtonProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('collection')

  const { handleDeleteCollection, isDeletingCollection, errorDeletingCollection } =
    useDeleteCollection({
      collectionRepository,
      onSuccessfulDelete: closeModalAndNavigateToParentCollection
    })

  const handleOpenModal = () => setShowConfirmationModal(true)
  const handleCloseModal = () => setShowConfirmationModal(false)

  function closeModalAndNavigateToParentCollection() {
    handleCloseModal()

    toast.success(t('collectionDeletedSuccess'))
    navigate(RouteWithParams.COLLECTIONS(parentCollection?.id))
  }

  return (
    <>
      <DropdownButtonItem onClick={handleOpenModal}>
        {t('editCollection.deleteCollection')}
      </DropdownButtonItem>
      <ConfirmDeleteCollectionModal
        show={showConfirmationModal}
        handleClose={handleCloseModal}
        handleDelete={() => handleDeleteCollection(collectionId)}
        isDeletingCollection={isDeletingCollection}
        errorDeletingCollection={errorDeletingCollection}
      />
    </>
  )
}
