import { createContext, useContext } from 'react'
import { CreateDatasetFormFields } from '../../dataset/domain/useCases/createDataset' // Importing the FormFields type

// Define the context and its interface
interface FormContextInterface {
  formState: CreateDatasetFormFields
  updateFormState: (newState: CreateDatasetFormFields) => void
}

// Define default values for the context
const defaultFormState: CreateDatasetFormFields = {
  // Initialize with default values for your form fields
  createDatasetTitle: ''
}

const defaultContext: FormContextInterface = {
  formState: defaultFormState,
  updateFormState: () => {
    // This is a no-op function since the default context shouldn't update anything
  }
}
export const FormContext = createContext<FormContextInterface>(defaultContext)
// Custom hook to use the form context
export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}
