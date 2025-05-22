import { FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { Setting } from '@/settings/domain/models/Setting'
import { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'
import { DataverseVersionMother } from '@tests/component/info/models/DataverseVersionMother'
import { TermsOfUseMother } from '@tests/component/info/models/TermsOfUseMother'
import { SettingMother } from '@tests/component/settings/domain/models/SettingMother'

export class DataverseInfoMockRepository implements DataverseInfoRepository {
  getVersion(): Promise<DataverseVersion> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DataverseVersionMother.create())
      }, 1_000)
    })
  }

  getTermsOfUse(): Promise<TermsOfUse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(TermsOfUseMother.create())
      }, 1_000)
    })
  }

  getZipDownloadLimit(): Promise<Setting<ZipDownloadLimit>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          SettingMother.createZipDownloadLimit(new ZipDownloadLimit(2, FileSizeUnit.GIGABYTES))
        )
      }, 1_000)
    })
  }

  getMaxEmbargoDurationInMonths(): Promise<Setting<number>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SettingMother.createMaxEmbargoDurationInMonths(12))
      }, 1_000)
    })
  }

  getHasPublicStore(): Promise<Setting<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SettingMother.createHasPublicStore(false))
      }, 1_000)
    })
  }
  getExternalStatusesAllowed(): Promise<Setting<string[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          SettingMother.createExternalStatusesAllowed([
            'Author Contacted',
            'Privacy Review',
            'Awaiting Paper Publication',
            'Final Approval'
          ])
        )
      }, 1_000)
    })
  }
}
