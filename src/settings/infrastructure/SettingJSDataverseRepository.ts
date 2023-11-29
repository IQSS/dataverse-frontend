import { SettingRepository } from '../domain/repositories/SettingRepository'
import { Setting, SettingName } from '../domain/models/Setting'
import { ZipDownloadLimit } from '../domain/models/ZipDownloadLimit'
import { FileSizeUnit } from '../../files/domain/models/File'

export class SettingJSDataverseRepository implements SettingRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getByName<T>(name: SettingName): Promise<Setting<T>> {
    // TODO - implement using js-dataverse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockedSettingResponse<T>(name))
      }, 1000)
    })
  }
}

function mockedSettingResponse<T>(name: SettingName): Setting<T> {
  switch (name) {
    case SettingName.ZIP_DOWNLOAD_LIMIT:
      return {
        name: SettingName.ZIP_DOWNLOAD_LIMIT,
        value: new ZipDownloadLimit(1, FileSizeUnit.BYTES)
      } as Setting<T>
    case SettingName.ALLOWED_EXTERNAL_STATUSES:
      return {
        name: SettingName.ALLOWED_EXTERNAL_STATUSES,
        value: [
          'Author Contacted',
          'Privacy Review',
          'Awaiting Paper Publication',
          'Final Approval'
        ]
      } as Setting<T>
    case SettingName.HAS_PUBLIC_STORE:
      return {
        name: SettingName.HAS_PUBLIC_STORE,
        value: false
      } as Setting<T>
  }
}
