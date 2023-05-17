import { createContext, useContext } from 'react'
import { DatasetTemplate } from '../../../dataset/domain/models/DatasetTemplate'

interface DatasetTemplateContextProps {
  template: DatasetTemplate | undefined
  setTemplateId: (id: string | undefined) => void
}

export const DatasetTemplateContext = createContext({} as DatasetTemplateContextProps)

export const useDatasetTemplate = () => useContext(DatasetTemplateContext)
