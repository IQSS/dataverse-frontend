export interface CreateDatasetFormData {
  createDatasetTitle: string
}

export class CreateDataset {
  submitDataset = async (formData: CreateDatasetFormData): Promise<string> => {
    console.log('Submitting dataset:', formData)
    return Promise.resolve('Form submitted successfully!')
  }

  validateCreateDatasetFormData = (formData: CreateDatasetFormData): boolean => {
    // Add validation logic here
    return formData.createDatasetTitle.trim() !== ''
  }
}
