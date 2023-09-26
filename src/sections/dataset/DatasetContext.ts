import { createContext, useContext } from 'react'
import { Dataset } from '../../dataset/domain/models/Dataset'

interface DatasetContextProps {
  dataset: Dataset | undefined
  isLoading: boolean
}
export const DatasetContext = createContext<DatasetContextProps>({
  dataset: undefined,
  isLoading: false
})

export const useDataset = () => useContext(DatasetContext)
