import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { RouteWithParams } from '@/sections/Route.enum'

interface UseDeleteFeaturedItemsReturn {
  errorDeletingFeaturedItems: string | null
  isDeletingFeaturedItems: boolean
  deleteFeaturedItems: () => void
}

export const useDeleteFeaturedItems = (
  collectionId: string,
  collectionRepository: CollectionRepository
): UseDeleteFeaturedItemsReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation('editCollectionFeaturedItems')
  const navigate = useNavigate()

  const deleteFeaturedItems = () => {
    setIsLoading(true)
    collectionRepository
      .deleteFeaturedItems(collectionId)
      .then(() => {
        setError(null)

        toast.success(t('deleteAll.success'))
        navigate(RouteWithParams.COLLECTIONS(collectionId))
      })
      .catch((err: WriteError) => {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError = error.getReasonWithoutStatusCode() ?? error.getErrorMessage()
        setError(formattedError)

        toast.error(formattedError, { autoClose: false })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return {
    errorDeletingFeaturedItems: error,
    isDeletingFeaturedItems: isLoading,
    deleteFeaturedItems
  }
}
