import { PropsWithChildren, useState } from 'react'
import { DatasetAlertContext } from './DatasetAlertContext'

import { DatasetAlert, DatasetAlertMessageKey } from '../../dataset/domain/models/Dataset'

export const DatasetAlertProvider = ({ children }: PropsWithChildren) => {
  const [datasetAlerts, setDatasetAlerts] = useState<DatasetAlert[]>([])

  const addDatasetAlert = (newAlert: DatasetAlert) => {
    setDatasetAlerts((prevAlerts) => [...prevAlerts, newAlert])
  }
  // This function will be accessible by any child component to update the datasetAlerts state
  const handleSetDatasetAlerts = (alerts: DatasetAlert[]) => {
    setDatasetAlerts(alerts)
  }
  const removeDatasetAlert = (alertId: DatasetAlertMessageKey) => {
    console.log('deleting alert', alertId)
    setDatasetAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.messageKey !== alertId))
  }

  return (
    <DatasetAlertContext.Provider
      value={{
        datasetAlerts,
        setDatasetAlerts: handleSetDatasetAlerts,
        addDatasetAlert,
        removeDatasetAlert
      }}>
      {children}
    </DatasetAlertContext.Provider>
  )
}
