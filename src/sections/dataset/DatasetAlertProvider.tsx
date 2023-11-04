import { PropsWithChildren, useState } from 'react'
import { DatasetAlertContext } from './DatasetAlertContext'

import { DatasetAlert } from '../../dataset/domain/models/Dataset'

export const DatasetAlertProvider = ({ children }: PropsWithChildren) => {
  const [datasetAlerts, setDatasetAlerts] = useState<DatasetAlert[]>([])

  // This function will be accessible by any child component to update the datasetAlerts state
  const handleSetDatasetAlerts = (alerts: DatasetAlert[]) => {
    setDatasetAlerts(alerts)
  }

  return (
    <DatasetAlertContext.Provider
      value={{ datasetAlerts, setDatasetAlerts: handleSetDatasetAlerts }}>
      {children}
    </DatasetAlertContext.Provider>
  )
}
