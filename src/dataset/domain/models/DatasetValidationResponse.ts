import { DatasetFormFields } from '../models/DatasetFormFields'

export interface DatasetValidationResponse {
  isValid: boolean
  errors: Record<keyof DatasetFormFields, string | undefined>
}
