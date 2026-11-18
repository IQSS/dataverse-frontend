import { useEffect, useState } from 'react'
import { Collection } from '@/collection/domain/models/Collection'
import { CollectionInputLevel } from '@/collection/domain/models/CollectionInputLevel'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getCollectionById } from '@/collection/domain/useCases/getCollectionById'
import { UpwardHierarchyNode } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'

interface Props {
  collectionRepository: CollectionRepository
  collection: Collection | undefined
}

interface UseCollectionInputLevelsReturn {
  inputLevels: CollectionInputLevel[]
  isLoading: boolean
}

/**
 * Gives the input levels (the fields a collection hides or requires) that apply to the datasets
 * created in a collection.
 *
 * A collection that is not a metadata block root takes its input levels from the nearest ancestor
 * that is one (the root collection counts as one), as Dataverse does when it validates a dataset,
 * so they are fetched from that ancestor. If an ancestor cannot be fetched, the input levels of the
 * collection itself are used.
 */
export const useCollectionInputLevels = ({
  collectionRepository,
  collection
}: Props): UseCollectionInputLevelsReturn => {
  const [inputLevels, setInputLevels] = useState<CollectionInputLevel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!collection) {
      return
    }

    let isCancelled = false
    setIsLoading(true)

    const getInputLevels = async (): Promise<CollectionInputLevel[]> => {
      if (collection.isMetadataBlockRoot) {
        return collection.inputLevels ?? []
      }

      let ancestorNode: UpwardHierarchyNode | undefined = collection.hierarchy.parent

      while (ancestorNode) {
        const ancestor = await getCollectionById(collectionRepository, ancestorNode.id)

        if (ancestor.isMetadataBlockRoot || !ancestorNode.parent) {
          return ancestor.inputLevels ?? []
        }

        ancestorNode = ancestorNode.parent
      }

      return collection.inputLevels ?? []
    }

    getInputLevels()
      .then((collectionInputLevels) => {
        if (!isCancelled) {
          setInputLevels(collectionInputLevels)
        }
      })
      .catch((error) => {
        console.error('There was an error getting the input levels of the collection', error)
        if (!isCancelled) {
          setInputLevels(collection.inputLevels ?? [])
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [collection, collectionRepository])

  return { inputLevels, isLoading }
}
