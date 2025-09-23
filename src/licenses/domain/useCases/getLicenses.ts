import { License } from '../models/License'
import { LicenseRepository } from '../repositories/LicenseRepository'

export function getLicenses(licenseRepository: LicenseRepository): Promise<License[]> {
  return licenseRepository.getAvailableStandardLicenses()
}
