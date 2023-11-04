import { createContext, useContext } from 'react'

import { DatasetAlert } from '../../dataset/domain/models/Dataset'

interface DatasetAlertContextProps {
  datasetAlerts: DatasetAlert[]
  setDatasetAlerts: (datasetAlerts: DatasetAlert[]) => void
}

export const DatasetAlertContext = createContext<DatasetAlertContextProps>({
  datasetAlerts: [],
  setDatasetAlerts: /* istanbul ignore next */ () => {}
})
export const useDatasetAlertContext = () => useContext(DatasetAlertContext)
