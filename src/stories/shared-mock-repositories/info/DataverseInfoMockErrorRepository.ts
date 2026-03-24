import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { DataverseInfoMockRepository } from './DataverseInfoMockRepository'
import { Setting } from '@/settings/domain/models/Setting'
import { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'
import { DatasetMetadataExportFormats } from '@/info/domain/models/DatasetMetadataExportFormats'

export class DataverseInfoMockErrorRepository implements DataverseInfoMockRepository {
  getVersion(): Promise<DataverseVersion> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }

  getTermsOfUse(): Promise<TermsOfUse> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }

  getZipDownloadLimit(): Promise<Setting<ZipDownloadLimit>> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }

  getMaxEmbargoDurationInMonths(): Promise<Setting<number>> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }

  getHasPublicStore(): Promise<Setting<boolean>> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }
  getExternalStatusesAllowed(): Promise<Setting<string[]>> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }

  getAvailableDatasetMetadataExportFormats(): Promise<DatasetMetadataExportFormats> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }
  getPublishDatasetDisclaimerText(): Promise<Setting<string>> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }
  getDatasetPublishPopupCustomText(): Promise<Setting<string>> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }
}
