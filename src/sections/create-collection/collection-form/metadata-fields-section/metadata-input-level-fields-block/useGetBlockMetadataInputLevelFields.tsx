import { useEffect, useState } from 'react'
import { MetadataBlockInfoRepository } from '../../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import {
  MetadataBlockInfo,
  MetadataBlockName,
  MetadataField
} from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { getMetadataBlockInfoByNameTemporal } from '../../../../../metadata-block-info/domain/useCases/getMetadataBlockInfoByNameTemporal'

interface Props {
  blockName: MetadataBlockName
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetBlockMetadataInputLevelsFieldsReturn {
  blockMetadataInputLevelFields: BlockMetadataInputLevelFields | undefined
  error: string | null
  isLoading: boolean
}

export interface BlockMetadataInputLevelFields {
  id: MetadataBlockInfo['id']
  name: MetadataBlockInfo['name']
  displayName: MetadataBlockInfo['displayName']
  metadataFields: Record<string, ReducedMetadataFieldInfo>
}

export type ReducedMetadataFieldInfo = Pick<MetadataField, 'name' | 'displayName'> & {
  childMetadataFields?: Record<string, Pick<MetadataField, 'name' | 'displayName'>>
}

export const useGetBlockMetadataInputLevelFields = ({
  blockName,
  metadataBlockInfoRepository
}: Props): UseGetBlockMetadataInputLevelsFieldsReturn => {
  const [blockMetadataInputLevelFields, setBlockMetadataInputLevelFields] = useState<
    BlockMetadataInputLevelFields | undefined
  >()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetInfo = async () => {
      setIsLoading(true)
      try {
        const blockInfo = await getMetadataBlockInfoByNameTemporal(
          metadataBlockInfoRepository,
          blockName
        )

        const formattedMetadataFields: BlockMetadataInputLevelFields['metadataFields'] =
          Object.entries(blockInfo.metadataFields).reduce((acc, [key, value]) => {
            const { name, displayName, childMetadataFields } = value
            const replaceDotWithSlash = (str: string) => str.replace(/\./g, '/')
            const normalizedName = replaceDotWithSlash(name)

            acc[key] = {
              name: normalizedName,
              displayName,
              childMetadataFields: childMetadataFields
                ? Object.entries(childMetadataFields).reduce((acc, [key, value]) => {
                    const { name, displayName } = value

                    const normalizedChildfieldName = replaceDotWithSlash(name)

                    acc[key] = {
                      name: normalizedChildfieldName,
                      displayName
                    }
                    return acc
                  }, {} as Record<string, Pick<MetadataField, 'name' | 'displayName'>>)
                : undefined
            }
            return acc
          }, {} as Record<string, ReducedMetadataFieldInfo>)

        const formattedBlockInfo: BlockMetadataInputLevelFields = {
          id: blockInfo.id,
          name: blockInfo.name,
          displayName: blockInfo.displayName,
          metadataFields: formattedMetadataFields
        }

        setBlockMetadataInputLevelFields(formattedBlockInfo)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the information from the metadata blocks. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetInfo()
  }, [metadataBlockInfoRepository, blockName])

  return {
    blockMetadataInputLevelFields,
    error,
    isLoading
  }
}
