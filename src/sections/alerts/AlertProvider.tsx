import { PropsWithChildren, useState } from 'react'
import { AlertContext } from './AlertContext'

import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'

export const AlertProvider = ({ children }: PropsWithChildren) => {
  const [datasetAlerts, setDatasetAlerts] = useState<Alert[]>([])

  const addDatasetAlert = (newAlert: Alert) => {
    const addDatasetAlert = (newAlert: Alert) => {
      setDatasetAlerts((prevAlerts) => {
        const alertExists = prevAlerts.some((alert) => alert.messageKey === newAlert.messageKey)
        if (!alertExists) return [...prevAlerts, newAlert]
        return prevAlerts
      })
    }
  }

  const removeDatasetAlert = (alertId: AlertMessageKey) => {
    setDatasetAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.messageKey !== alertId))
  }

  return (
    <AlertContext.Provider
      value={{
        datasetAlerts,
        addDatasetAlert,
        removeDatasetAlert,
        setDatasetAlerts
      }}>
      {children}
    </AlertContext.Provider>
  )
}
