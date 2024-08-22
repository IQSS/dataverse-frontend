import { useEffect, useState } from 'react'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import {
  MetadataBlockInfo,
  MetadataBlockName,
  MetadataField
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { getAllMetadataBlocksInfoTemporal } from '../../metadata-block-info/domain/useCases/getAllMetadataBlocksInfoTemporal'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetAllMetadataBlocksInfo {
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

export type ReducedMetadataFieldsAndChildsInfo = Pick<
  MetadataField,
  'name' | 'displayName' | 'isRequired'
>

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

export const useGetAllMetadataBlocksInfo = ({
  metadataBlockInfoRepository
}: Props): UseGetAllMetadataBlocksInfo => {
  const [allMetadataBlocksInfo, setAllMetadataBlocksInfo] = useState<ReducedMetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetInfo = async () => {
      setIsLoading(true)
      try {
        const blocksInfo = await getAllMetadataBlocksInfoTemporal(
          metadataBlockInfoRepository,
          blocksNames
        )

        const reducedMetadataBlocksInfo: ReducedMetadataBlockInfo[] =
          reduceMetadataBlocksInfo(blocksInfo)

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

export function reduceMetadataBlocksInfo(
  allMetadataBlocksInfo: MetadataBlockInfo[]
): ReducedMetadataBlockInfo[] {
  return allMetadataBlocksInfo.map((blockInfo) => {
    const formattedMetadataFields: Record<string, ReducedMetadataFieldInfo> = Object.entries(
      blockInfo.metadataFields
    ).reduce((acc, [key, value]) => {
      const { name, displayName, isRequired, childMetadataFields } = value
      const replaceDotWithSlash = (str: string) => str.replace(/\./g, '/')
      const normalizedName = replaceDotWithSlash(name)

      acc[key] = {
        name: normalizedName,
        displayName,
        isRequired,
        childMetadataFields: childMetadataFields
          ? Object.entries(childMetadataFields).reduce((acc, [key, value]) => {
              const { name, displayName, isRequired } = value

              const normalizedChildfieldName = replaceDotWithSlash(name)

              acc[key] = {
                name: normalizedChildfieldName,
                displayName,
                isRequired
              }
              return acc
            }, {} as Record<string, ReducedMetadataFieldInfo>)
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
  })
}
