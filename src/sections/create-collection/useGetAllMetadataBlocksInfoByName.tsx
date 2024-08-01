import { useEffect, useState } from 'react'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import {
  MetadataBlockInfo,
  MetadataBlockName,
  MetadataField
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { getMetadataBlockInfoByNameTemporal } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByNameTemporal'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetAllMetadataBlocksInfoByName {
  allMetadataBlocksInfo: ReducedMetadataBlockInfo[]
  error: string | null
  isLoading: boolean
}

export interface ReducedMetadataBlockInfo {
  id: MetadataBlockInfo['id']
  name: MetadataBlockInfo['name']
  displayName: MetadataBlockInfo['displayName']
  metadataFields: Record<string, ReducedMetadataFieldInfo>
}

export type ReducedMetadataFieldsAndChildsInfo = Pick<MetadataField, 'name' | 'displayName'>

export type ReducedMetadataFieldInfo = ReducedMetadataFieldsAndChildsInfo & {
  childMetadataFields?: Record<string, ReducedMetadataFieldsAndChildsInfo>
}

const blocksNames: MetadataBlockName[] = [
  MetadataBlockName.CITATION,
  MetadataBlockName.GEOSPATIAL,
  MetadataBlockName.SOCIAL_SCIENCE,
  MetadataBlockName.ASTROPHYSICS,
  MetadataBlockName.BIOMEDICAL,
  MetadataBlockName.JOURNAL
]

export const useGetAllMetadataBlocksInfoByName = ({
  metadataBlockInfoRepository
}: Props): UseGetAllMetadataBlocksInfoByName => {
  const [allMetadataBlocksInfo, setAllMetadataBlocksInfo] = useState<ReducedMetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetInfo = async () => {
      setIsLoading(true)
      try {
        const promises = blocksNames.map((blockName) =>
          getMetadataBlockInfoByNameTemporal(metadataBlockInfoRepository, blockName)
        )

        const blocksInfo = await Promise.all(promises)

        const reducedMetadataBlocksInfo: ReducedMetadataBlockInfo[] = blocksInfo.map(
          (blockInfo) => {
            const formattedMetadataFields: Record<string, ReducedMetadataFieldInfo> =
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

            const reducedMetadataBlockInfo: ReducedMetadataBlockInfo = {
              id: blockInfo.id,
              name: blockInfo.name,
              displayName: blockInfo.displayName,
              metadataFields: formattedMetadataFields
            }

            return reducedMetadataBlockInfo
          }
        )

        setAllMetadataBlocksInfo(reducedMetadataBlocksInfo)
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
  }, [metadataBlockInfoRepository])

  return {
    allMetadataBlocksInfo,
    error,
    isLoading
  }
}
