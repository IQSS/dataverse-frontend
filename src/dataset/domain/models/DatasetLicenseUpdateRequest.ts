import { CustomTerms } from './Dataset'

export interface DatasetLicenseUpdateRequest {
  name?: string
  customTerms?: CustomTerms
}
