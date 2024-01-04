// import { DatasetRepository } from '../repositories/DatasetRepository'
// import { AddNewDataset } from '../repositories/DatasetRepository'
// import { Dataset } from '../models/Dataset'

interface CreateDatasetFormData {
  createDatasetTitle: string
}

export class AddNewDataset {
  validateCreateDatasetFormData(formData: CreateDatasetFormData): boolean {
    // Add validation logic here
    return formData.createDatasetTitle.trim() !== ''
  }

  async submitCreateDatasetFormData(): Promise<string> {
    // Add business logic for form submission here
    return Promise.resolve('Form submitted successfully!')
  }
}

export async function createDataset(formData: CreateDatasetFormData): Promise<AddNewDataset> {
  try {
    const dataset = new AddNewDataset()
    if (!dataset.validateCreateDatasetFormData(formData)) {
      throw new Error('Invalid form data')
    }
    await dataset.submitCreateDatasetFormData()
    return dataset
  } catch (error) {
    throw new Error(`Dataset creation failed`)
  }
}
