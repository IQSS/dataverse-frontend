import { faker } from '@faker-js/faker'
import { Setting, SettingName } from '../../../../../src/settings/domain/models/Setting'
import { ZipDownloadLimit } from '../../../../../src/settings/domain/models/ZipDownloadLimit'
import { FileSizeUnit } from '../../../../../src/files/domain/models/File'

export class SettingMother {
  static createZipDownloadLimit(value?: ZipDownloadLimit): Setting<ZipDownloadLimit> {
    return {
      name: SettingName.ZIP_DOWNLOAD_LIMIT,
      value: value
        ? value
        : new ZipDownloadLimit(
            faker.datatype.number(),
            faker.helpers.arrayElement(Object.values(FileSizeUnit))
          )
    }
  }

  static createExternalStatusesAllowed(value?: string[]): Setting<string[]> {
    return {
      name: SettingName.ALLOWED_EXTERNAL_STATUSES,
      value: value ? value : [faker.datatype.string(), faker.datatype.string()]
    }
  }
}
