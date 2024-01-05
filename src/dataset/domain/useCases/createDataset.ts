// import { DatasetRepository } from '../repositories/DatasetRepository'
// import { AddNewDataset } from '../repositories/DatasetRepository'
// import { Dataset } from '../models/Dataset'

export interface CreateDatasetFormData {
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

// export async function CreateDataset(formData: CreateDatasetFormData): Promise<AddNewDataset> {
//   try {
//     const dataset = new AddNewDataset()
//     if (!dataset.validateCreateDatasetFormData(formData)) {
//       throw new Error('Invalid form data')
//     }
//     await dataset.submitCreateDatasetFormData()
//     return dataset
//   } catch (error) {
//     throw new Error(`Dataset creation failed`)
//   }
// }

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
