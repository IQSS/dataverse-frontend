import { License } from '../models/License'

export interface LicenseRepository {
  getAvailableStandardLicenses: () => Promise<License[]>
}
