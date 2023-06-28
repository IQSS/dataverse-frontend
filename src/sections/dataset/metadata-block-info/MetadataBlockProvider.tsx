import { PropsWithChildren, useEffect, useState } from 'react'
import { MetadataBlockInfoContext } from './MetadataBlockInfoContext'
import { MetadataBlockInfo } from '../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { getMetadataBlockInfoByName } from '../../../metadata-block-info/domain/useCases/getMetadataBlockInfoByName'
import { MetadataBlockName } from '../../../dataset/domain/models/Dataset'

export function MetadataBlockInfoProvider({
  children,
  repository
}: PropsWithChildren<{ repository: MetadataBlockInfoRepository }>) {
  const [metadataBlockName, setMetadataBlockName] = useState<string>(MetadataBlockName.CITATION)
  const [metadataBlockInfo, setMetadataBlockInfo] = useState<MetadataBlockInfo>()

  useEffect(() => {
    getMetadataBlockInfoByName(repository, metadataBlockName)
      .then((metadataBlockInfo) => {
        setMetadataBlockInfo(metadataBlockInfo)
      })
      .catch((error) => console.error('There was an error getting the metadata block info', error))
  }, [repository, metadataBlockName])

  return (
    <MetadataBlockInfoContext.Provider value={{ metadataBlockInfo, setMetadataBlockName }}>
      {children}
    </MetadataBlockInfoContext.Provider>
  )
}
