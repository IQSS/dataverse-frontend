import { createContext, SetStateAction, useContext } from 'react'

import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'

interface AlertContextProps {
  alerts: Alert[]
  addAlert: (newAlert: Alert) => void
  removeAlert: (alertId: AlertMessageKey) => void
  setAlerts: (value: SetStateAction<Alert[]>) => void
}

export const AlertContext = createContext<AlertContextProps>({
  alerts: [],
  addAlert: /* istanbul ignore next */ () => {},
  removeAlert: /* istanbul ignore next */ () => {},
  // eslint-disable-next-line unused-imports/no-unused-vars
  setAlerts: () => {}
})
export const useAlertContext = () => useContext(AlertContext)
