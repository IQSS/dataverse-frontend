// containers/FormContainer.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { FormInputElement } from '@iqss/dataverse-design-system/src/lib/components/form/form-group/form-element/FormInput'
import CreateDatasetUseCase from './CreateDatasetUseCase'
import CreateDatasetFormPresenter from './CreateDataset'

const CreateDatasetContainer: React.FC = () => {
  const [formData, setFormData] = useState({
    createDatasetTitle: ''
  })

  const [submitComplete, setSubmitComplete] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const handleCreateDatasetFieldChange = (event: ChangeEvent<FormInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleCreateDatasetSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const formUseCase = new CreateDatasetUseCase()

    console.log('handleCreateDatasetSubmit() formData | ', formData)

    if (formUseCase.validateCreateDatasetFormData(formData)) {
      try {
        setSubmitting(true)
        console.log('Status: Submitting | ', submitting)

        // Simulate an asynchronous operation, e.g., API call
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const result = await formUseCase.submitCreateDatasetFormData(formData)
        console.log(result)
        setSubmitComplete(true)
        // Handle success, e.g., show a success message
      } catch (error) {
        console.error('Error submitting form:', error)
        // Handle error, e.g., show an error message
      } finally {
        setSubmitting(false)
      }
    } else {
      // Handle validation error, e.g., show validation messages
      console.error('Form validation failed')
    }
    // Explicitly return a Promise<void>
    return Promise.resolve()
  }

  return (
    // TODO: conditional view, needs to be lower in the component heirarchy
    // {submitting && <div>Submtting Form...</div>}
    <>
      {submitting && <p>Submitting...</p>}
      {!submitting && (
        <CreateDatasetFormPresenter
          submitComplete={submitComplete}
          formData={formData}
          handleCreateDatasetFieldChange={handleCreateDatasetFieldChange}
          // TODO: Fix using IIFE (Immediately-invoked Function Expression)
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          handleCreateDatasetSubmit={handleCreateDatasetSubmit}
          submitting={submitting}
        />
      )}
    </>
  )
}

export default CreateDatasetContainer
