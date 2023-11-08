import { createContext, useContext } from 'react'

import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'

interface DatasetAlertContextProps {
  datasetAlerts: Alert[]
  addDatasetAlert: (newAlert: Alert) => void
  removeDatasetAlert: (alertId: AlertMessageKey) => void
}

export const DatasetAlertContext = createContext<DatasetAlertContextProps>({
  datasetAlerts: [],
  addDatasetAlert: /* istanbul ignore next */ () => {},
  removeDatasetAlert: /* istanbul ignore next */ () => {}
})
export const useAlertContext = () => useContext(DatasetAlertContext)
