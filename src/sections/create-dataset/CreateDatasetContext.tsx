// containers/FormContainer.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { FormInputElement } from '@iqss/dataverse-design-system/src/lib/components/form/form-group/form-element/FormInput'
import CreateDatasetFormPresenter from './CreateDatasetForm'
import { createDataset } from '../../dataset/domain/useCases/createDataset'

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateDatasetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const addNewDataset = await createDataset(formData)

      if (addNewDataset.validateCreateDatasetFormData(formData)) {
        setSubmitting(true)
        // Simulate an asynchronous operation, e.g., API call
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const result = await addNewDataset.submitCreateDatasetFormData()
        console.log(result)
        setSubmitComplete(true)
      } else {
        console.error('Form validation failed')
      }
    } catch (error: any) {
      console.error('Error submitting form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <p>Submitting...</p>}
      {!submitting && (
        <CreateDatasetFormPresenter
          submitComplete={submitComplete}
          formData={formData}
          handleCreateDatasetFieldChange={handleCreateDatasetFieldChange}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          handleCreateDatasetSubmit={handleCreateDatasetSubmit}
          submitting={submitting}
        />
      )}
    </>
  )
}

export default CreateDatasetContainer
