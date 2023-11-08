import { PropsWithChildren, useState } from 'react'
import { DatasetAlertContext } from './DatasetAlertContext'

import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'

export const DatasetAlertProvider = ({ children }: PropsWithChildren) => {
  const [datasetAlerts, setDatasetAlerts] = useState<Alert[]>([])

  const addDatasetAlert = (newAlert: Alert) => {
    // Check if an alert with the same id already exists
    const alertExists = datasetAlerts.some((alert) => alert.messageKey === newAlert.messageKey)

    // If it doesn't exist, add it to the array
    if (!alertExists) datasetAlerts.push(newAlert)
  }

  const removeDatasetAlert = (alertId: AlertMessageKey) => {
    setDatasetAlerts(datasetAlerts.filter((alert) => alert.messageKey !== alertId))
  }

  return (
    <DatasetAlertContext.Provider
      value={{
        datasetAlerts,
        addDatasetAlert,
        removeDatasetAlert
      }}>
      {children}
    </DatasetAlertContext.Provider>
  )
}
