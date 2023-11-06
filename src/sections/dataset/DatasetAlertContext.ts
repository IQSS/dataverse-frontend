import { createContext, useContext } from 'react'

import { DatasetAlert, DatasetAlertMessageKey } from '../../dataset/domain/models/Dataset'

interface DatasetAlertContextProps {
  setDatasetAlerts: (datasetAlerts: DatasetAlert[]) => void
  datasetAlerts: DatasetAlert[]
  addDatasetAlert: (newAlert: DatasetAlert) => void
  removeDatasetAlert: (alertId: DatasetAlertMessageKey) => void
}

export const DatasetAlertContext = createContext<DatasetAlertContextProps>({
  datasetAlerts: [],
  setDatasetAlerts: /* istanbul ignore next */ () => {},
  addDatasetAlert: () => {},
  removeDatasetAlert: () => {}
})
export const useDatasetAlertContext = () => useContext(DatasetAlertContext)
