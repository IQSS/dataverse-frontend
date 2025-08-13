import { createContext, useContext } from 'react'
import { Dataset } from '../../dataset/domain/models/Dataset'

interface DatasetContextProps {
  dataset: Dataset | undefined
  isLoading: boolean
  refreshDataset: () => void
}
export const DatasetContext = createContext<DatasetContextProps>({
  dataset: undefined,
  isLoading: false,
  refreshDataset: () => {}
})

export const useDataset = () => useContext(DatasetContext)
