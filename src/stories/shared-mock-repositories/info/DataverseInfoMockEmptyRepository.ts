import { DatasetMetadataExportFormats } from '@/info/domain/models/DatasetMetadataExportFormats'
import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { Setting, SettingName } from '@/settings/domain/models/Setting'
import { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'
import { FileSizeUnit } from '@/files/domain/models/FileMetadata'

export class DataverseInfoMockEmptyRepository implements DataverseInfoRepository {
  private readonly delayMs = 100

  getVersion(): Promise<DataverseVersion> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({} as DataverseVersion)
      }, this.delayMs)
    })
  }

  getTermsOfUse(): Promise<TermsOfUse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, this.delayMs)
    })
  }

  getZipDownloadLimit(): Promise<Setting<ZipDownloadLimit>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: SettingName.ZIP_DOWNLOAD_LIMIT,
          value: new ZipDownloadLimit(0, FileSizeUnit.BYTES)
        })
      }, this.delayMs)
    })
  }

  getMaxEmbargoDurationInMonths(): Promise<Setting<number>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: SettingName.MAX_EMBARGO_DURATION_IN_MONTHS, value: 0 })
      }, this.delayMs)
    })
  }

  getHasPublicStore(): Promise<Setting<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: SettingName.HAS_PUBLIC_STORE, value: false })
      }, this.delayMs)
    })
  }

  getExternalStatusesAllowed(): Promise<Setting<string[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: SettingName.ALLOWED_EXTERNAL_STATUSES, value: [] })
      }, this.delayMs)
    })
  }

  getAvailableDatasetMetadataExportFormats(): Promise<DatasetMetadataExportFormats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({})
      }, this.delayMs)
    })
  }

  getPublishDatasetDisclaimerText(): Promise<Setting<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: SettingName.PUBLISH_DATASET_DISCLAIMER_TEXT, value: '' })
      }, this.delayMs)
    })
  }

  getDatasetPublishPopupCustomText(): Promise<Setting<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: SettingName.DATASET_PUBLISH_POPUP_CUSTOM_TEXT, value: '' })
      }, this.delayMs)
    })
  }
}
