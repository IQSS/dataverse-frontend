import { faker } from '@faker-js/faker'
import { Setting, SettingName } from '../../../../../src/settings/domain/models/Setting'
import { ZipDownloadLimit } from '../../../../../src/settings/domain/models/ZipDownloadLimit'
import { FileSizeUnit } from '../../../../../src/files/domain/models/FileMetadata'

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

  static createHasPublicStore(value?: boolean): Setting<boolean> {
    return {
      name: SettingName.HAS_PUBLIC_STORE,
      value: value ? value : faker.datatype.boolean()
    }
  }

  static createMaxEmbargoDurationInMonths(value?: number): Setting<number> {
    return {
      name: SettingName.MAX_EMBARGO_DURATION_IN_MONTHS,
      value: value ? value : faker.datatype.number()
    }
  }
}
