import { useEffect, useState } from 'react'
import { getMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import {
  MetadataBlockInfo2,
  MetadataField2
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId: string
  mode: 'create' | 'edit'
}
/**
 * Hook to get the metadata blocks to show and its info, based on the parent collection id of the dataset
 *
 * @param metadataBlockInfoRepository The repository to get the metadata block info
 * @param collectionId The id of the collection that the dataset belongs to
 * @param mode The mode of the form (create or edit), if edit mode, this hook will return only the metadata blocks that have displayOnCreate set to true
 */
export const useGetMetadataBlocksInfo = ({
  metadataBlockInfoRepository,
  collectionId,
  mode
}: Props) => {
  const [metadataBlocks, setMetadataBlocks] = useState<MetadataBlockInfo2[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const onCreateMode = mode === 'create'

  // TODO:ME : Do the opposite of this function when saving the metadata and sending it to the backend (replace slashes with dots)
  function replaceDotsWithSlashes(metadataFields: Record<string, MetadataField2> | undefined) {
    if (!metadataFields) return

    for (const key in metadataFields) {
      const field = metadataFields[key]
      if (field.name.includes('.')) {
        field.name = field.name.replace(/\./g, '/')
      }
      if (field.childMetadataFields) {
        replaceDotsWithSlashes(field.childMetadataFields)
      }
    }
  }

  // Function to modify name properties in the array of objects
  function modifyNames(metadataBlocks: MetadataBlockInfo2[]): MetadataBlockInfo2[] {
    for (const block of metadataBlocks) {
      if (block.metadataFields) {
        replaceDotsWithSlashes(block.metadataFields)
      }
    }
    return metadataBlocks
  }

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        const metadataBlocksInfo = await getMetadataBlockInfoByCollectionId(
          metadataBlockInfoRepository,
          collectionId,
          onCreateMode
        )

        const mappedMetadataBlocks = modifyNames(metadataBlocksInfo)

        console.log({ mappedMetadataBlocks })

        // console.log({ mappedMetadataBlocks })
        setMetadataBlocks(metadataBlocksInfo)
      } catch (err) {
        console.error(err)
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the information from the metadata blocks. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    void handleGetDatasetMetadataBlockFields()
  }, [])

  return {
    metadataBlocks,
    error,
    isLoading
  }
}
