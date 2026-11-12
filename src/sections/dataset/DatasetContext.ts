import { createContext, useContext } from 'react'
import { Dataset } from '../../dataset/domain/models/Dataset'

interface DatasetContextProps {
  dataset: Dataset | undefined
  isLoading: boolean
  refreshDataset: () => void
  isNotAuthorized?: boolean
}
export const DatasetContext = createContext<DatasetContextProps>({
  dataset: undefined,
  isLoading: false,
  refreshDataset: () => {},
  isNotAuthorized: false
})

export const useDataset = () => useContext(DatasetContext)
