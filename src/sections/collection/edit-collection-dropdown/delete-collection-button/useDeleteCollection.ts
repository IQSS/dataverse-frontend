import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { deleteCollection } from '@/collection/domain/useCases/deleteCollection'
import { Utils } from '@/shared/helpers/Utils'

interface UseDeleteCollection {
  collectionRepository: CollectionRepository
  onSuccessfulDelete?: () => void
}

interface UseDeleteCollectionReturn {
  isDeletingCollection: boolean
  errorDeletingCollection: string | null
  handleDeleteCollection: (collectionIdOrAlias: number | string) => Promise<void>
}

export const useDeleteCollection = ({
  collectionRepository,
  onSuccessfulDelete
}: UseDeleteCollection): UseDeleteCollectionReturn => {
  const { t } = useTranslation('collection')
  const [isDeletingCollection, setIsDeletingCollection] = useState<boolean>(false)
  const [errorDeletingCollection, setErrorDeletingCollection] = useState<string | null>(null)

  const handleDeleteCollection = async (collectionIdOrAlias: number | string) => {
    setIsDeletingCollection(true)

    try {
      await deleteCollection(collectionRepository, collectionIdOrAlias)

      // Wait before calling onSuccessfulDelete (which is redirecting to parent collection)
      // Otherwise Search API will still return the deleted collection item
      await Utils.sleep(3000)

      onSuccessfulDelete?.()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorDeletingCollection(formattedError)
      } else {
        setErrorDeletingCollection(t('defaultCollectionDeleteError'))
      }
    } finally {
      setIsDeletingCollection(false)
    }
  }

  return {
    isDeletingCollection,
    errorDeletingCollection,
    handleDeleteCollection
  }
}
