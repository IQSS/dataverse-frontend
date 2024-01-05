// containers/FormContainer.tsx

import { createContext, useContext, ReactNode } from 'react'
import CreateDatasetFormPresenter from './CreateDatasetForm'
import { useTranslation } from 'react-i18next'
import { CreateDataset, CreateDatasetFormData } from '../../dataset/domain/useCases/createDataset'
import styles from '/src/sections/dataset/Dataset.module.scss'
import { SeparationLine } from '../../components/layout/SeparationLine/SeparationLine'

interface CreateDatasetFormProps {
  submitDataset: (formData: CreateDatasetFormData) => Promise<string>
  validateCreateDatasetFormData: (formData: CreateDatasetFormData) => boolean
  // handleCreateDatasetFieldChange: (event: ChangeEvent<HTMLInputElement>) => void
  // handleCreateDatasetSubmit: (event: FormEvent<HTMLFormElement>) => void
  // submitting: boolean
  // submitComplete: boolean
}

const DatasetContext = createContext<CreateDatasetFormProps>({} as CreateDatasetFormProps)
interface DatasetProviderProps {
  children: ReactNode
}
// eslint-disable-next-line react/prop-types
export const DatasetProvider: React.FC<DatasetProviderProps> = ({ children }) => {
  const createDatasetUseCase = new CreateDataset()

  return (
    // eslint-disable-next-line @typescript-eslint/unbound-method
    <DatasetContext.Provider
      value={{
        // eslint-disable-next-line @typescript-eslint/unbound-method
        submitDataset: createDatasetUseCase.submitDataset,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        validateCreateDatasetFormData: createDatasetUseCase.validateCreateDatasetFormData
      }}>
      {children}
    </DatasetContext.Provider>
  )
}
// Hook for easy consumption of the context
export const useDataset = () => useContext(DatasetContext)

export function CreateDatasetContainer() {
  // const [formData, setFormData] = useState({
  //   createDatasetTitle: ''
  // })
  const { t } = useTranslation('createDataset')

  // const [submitComplete, setSubmitComplete] = useState(false)

  // const [submitting, setSubmitting] = useState(false)

  // const handleCreateDatasetFieldChange = (event: ChangeEvent<FormInputElement>): void => {
  //   const { name, value } = event.target
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value
  //   }))
  // }
  // async function handleCreateDatasetFormSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault()
  //   try {
  //     const addNewDataset = await CreateDataset(formData)

  //     if (addNewDataset.validateCreateDatasetFormData(formData)) {
  //       setSubmitting(true)
  //       // Simulate an asynchronous operation, e.g., API call
  //       await new Promise((resolve) => setTimeout(resolve, 3000))
  //       const result = await addNewDataset.submitCreateDatasetFormData()
  //       console.log(result)
  //       setSubmitComplete(true)
  //       onSubmitForm(JSON.stringify(formData))
  //     } else {
  //       console.error('Form validation failed')
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     console.error('Error submitting form:', error)
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }
  // const handleCreateDatasetSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()

  //   try {
  //     const addNewDataset = await createDataset(formData)

  //     if (addNewDataset.validateCreateDatasetFormData(formData)) {
  //       setSubmitting(true)
  //       // Simulate an asynchronous operation, e.g., API call
  //       await new Promise((resolve) => setTimeout(resolve, 3000))
  //       const result = await addNewDataset.submitCreateDatasetFormData()
  //       console.log(result)
  //       setSubmitComplete(true)
  //     } else {
  //       console.error('Form validation failed')
  //     }
  //   } catch (error: any) {
  //     console.error('Error submitting form:', error)
  //   } finally {
  //     setSubmitting(false)
  //   }
  //   onSubmitForm(JSON.stringify(formData))
  // }

  return (
    <>
      <article>
        <header className={styles.header}>
          <h1>{t('pageTitle')}</h1>
        </header>
        <SeparationLine />
        <div className={styles.container}>
          <CreateDatasetFormPresenter
          // submitComplete={submitComplete}
          // formData={formData}
          // handleCreateDatasetFieldChange={handleCreateDatasetFieldChange}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          // handleCreateDatasetSubmit={handleCreateDatasetFormSubmit}
          // submitting={submitting}
          />
        </div>
      </article>
    </>
  )
}

export const DatasetCreateMaster: React.FC = () => {
  return (
    <DatasetProvider>
      <h1>Dataset Submission Form</h1>
      <CreateDatasetContainer />
    </DatasetProvider>
  )
}
export default DatasetCreateMaster
