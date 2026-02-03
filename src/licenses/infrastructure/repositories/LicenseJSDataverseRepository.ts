import { LicenseRepository } from '../../domain/repositories/LicenseRepository'
import { License } from '../../domain/models/License'
import { getAvailableStandardLicenses } from '@iqss/dataverse-client-javascript'

export class LicenseJSDataverseRepository implements LicenseRepository {
  async getAvailableStandardLicenses(): Promise<License[]> {
    return (await getAvailableStandardLicenses.execute()) as License[]
  }
}
