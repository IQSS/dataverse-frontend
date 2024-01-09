import React, { createContext, useContext, ReactNode } from 'react'
import CreateDatasetFormPresenter from './CreateDatasetForm'
import { useTranslation } from 'react-i18next'
import { CreateDataset, CreateDatasetFormData } from '../../dataset/domain/useCases/createDataset'
import styles from '/src/sections/dataset/Dataset.module.scss'
import { SeparationLine } from '../../components/layout/SeparationLine/SeparationLine'

interface CreateDatasetFormProps {
  submitDataset: (formData: CreateDatasetFormData) => Promise<string>
  validateCreateDatasetFormData: (formData: CreateDatasetFormData) => boolean
}

const DatasetContext = createContext<CreateDatasetFormProps>({} as CreateDatasetFormProps)
interface DatasetProviderProps {
  children: ReactNode
}
export const DatasetProvider: React.FC<DatasetProviderProps> = ({ children }) => {
  const createDatasetUseCase = new CreateDataset()

  return (
    <DatasetContext.Provider
      value={{
        submitDataset: createDatasetUseCase.submitDataset,
        validateCreateDatasetFormData: createDatasetUseCase.validateCreateDatasetFormData
      }}>
      {children}
    </DatasetContext.Provider>
  )
}
// Hook for easy consumption of the context
export const useDataset = () => useContext(DatasetContext)

export function CreateDatasetContainer() {
  const { t } = useTranslation('createDataset')
  return (
    <>
      <article>
        <header className={styles.header}>
          <h1>{t('pageTitle')}</h1>
        </header>
        <SeparationLine />
        <div className={styles.container}>
          <CreateDatasetFormPresenter />
        </div>
      </article>
    </>
  )
}

export const DatasetCreateMaster: React.FC = () => {
  return (
    <DatasetProvider>
      <CreateDatasetContainer />
    </DatasetProvider>
  )
}
export default DatasetCreateMaster
