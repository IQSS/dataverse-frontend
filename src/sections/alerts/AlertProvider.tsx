import { PropsWithChildren, useState } from 'react'
import { AlertContext } from './AlertContext'

import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'

export const AlertProvider = ({ children }: PropsWithChildren) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = (newAlert: Alert) => {
    setAlerts((prevAlerts) => {
      const alertExists = prevAlerts.some((alert) => alert.messageKey === newAlert.messageKey)
      if (!alertExists) return [...prevAlerts, newAlert]
      return prevAlerts
    })
  }

  const removeAlert = (alertId: AlertMessageKey) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.messageKey !== alertId))
  }

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        setAlerts
      }}>
      {children}
    </AlertContext.Provider>
  )
}
