import { createContext, useContext } from 'react'

import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'

interface DatasetAlertContextProps {
  datasetAlerts: Alert[]
  addDatasetAlert: (newAlert: Alert) => void
  removeDatasetAlert: (alertId: AlertMessageKey) => void
  setDatasetAlerts: (alerts: Alert[]) => void
}

export const AlertContext = createContext<DatasetAlertContextProps>({
  datasetAlerts: [],
  addDatasetAlert: /* istanbul ignore next */ () => {},
  removeDatasetAlert: /* istanbul ignore next */ () => {},
  // eslint-disable-next-line unused-imports/no-unused-vars
  setDatasetAlerts: (alerts: Alert[]) => {}
})
export const useAlertContext = () => useContext(AlertContext)
