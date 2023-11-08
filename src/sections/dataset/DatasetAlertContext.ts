import { createContext, useContext } from 'react'

import { DatasetAlert, DatasetAlertMessageKey } from '../../dataset/domain/models/Dataset'

interface DatasetAlertContextProps {
  datasetAlerts: DatasetAlert[]
  addDatasetAlert: (newAlert: DatasetAlert) => void
  removeDatasetAlert: (alertId: DatasetAlertMessageKey) => void
}

export const DatasetAlertContext = createContext<DatasetAlertContextProps>({
  datasetAlerts: [],
  addDatasetAlert: /* istanbul ignore next */ () => {},
  removeDatasetAlert: /* istanbul ignore next */ () => {}
})
export const useAlertContext = () => useContext(DatasetAlertContext)
