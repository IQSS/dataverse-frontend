import { createContext, useContext } from 'react'
import { DatasetCurationStatus } from '@/dataset/domain/models/DatasetCuration'

export interface DatasetCurationStatusContextProps {
  currentStatus: DatasetCurationStatus | null
  allowedLabels: string[]
  canSeeCurationStatus: boolean
  canChangeCurationStatus: boolean
  refreshCurationStatus: () => void
}

export const DatasetCurationStatusContext = createContext<DatasetCurationStatusContextProps>({
  currentStatus: null,
  allowedLabels: [],
  canSeeCurationStatus: false,
  canChangeCurationStatus: false,
  refreshCurationStatus: () => {}
})

export const useDatasetCurationStatus = () => useContext(DatasetCurationStatusContext)
