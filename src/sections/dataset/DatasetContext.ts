import { createContext, useContext } from 'react'
import { Dataset } from '../../dataset/domain/models/Dataset'

interface DatasetContextProps {
  dataset: Dataset | undefined
}
export const DatasetContext = createContext<DatasetContextProps>({
  dataset: undefined
})

export const useDataset = () => useContext(DatasetContext)
