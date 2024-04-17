import { createContext, useContext } from 'react'
import { MetadataBlockName } from '../../../dataset/domain/models/Dataset'
import { MetadataBlockInfoDisplayFormat } from '../../../metadata-block-info/domain/models/MetadataBlockInfo'

interface MetadataBlockInfoContextProps {
  metadataBlockInfo: MetadataBlockInfoDisplayFormat | undefined
  setMetadataBlockName: (metadataBlockName: MetadataBlockName) => void
}

export const MetadataBlockInfoContext = createContext<MetadataBlockInfoContextProps>({
  metadataBlockInfo: undefined,
  setMetadataBlockName: /* istanbul ignore next */ (): void => {}
})

export const useMetadataBlockInfo = () => useContext(MetadataBlockInfoContext)
