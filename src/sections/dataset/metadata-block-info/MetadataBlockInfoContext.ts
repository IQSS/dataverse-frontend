import { createContext, useContext } from 'react'
import { MetadataBlockName } from '../../../dataset/domain/models/Dataset'
import { MetadataBlockInfo } from '../../../metadata-block-info/domain/models/MetadataBlockInfo'

interface MetadataBlockInfoContextProps {
  metadataBlockInfo: MetadataBlockInfo | undefined
  setMetadataBlockName: (metadataBlockName: MetadataBlockName) => void
}

export const MetadataBlockInfoContext = createContext<MetadataBlockInfoContextProps>({
  metadataBlockInfo: undefined,
  setMetadataBlockName: /* istanbul ignore next */ (): void => {}
})

export const useMetadataBlockInfo = () => useContext(MetadataBlockInfoContext)
