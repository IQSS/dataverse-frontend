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
        resolve({
          name: SettingName.ZIP_DOWNLOAD_LIMIT,
          value: new ZipDownloadLimit(500, FileSizeUnit.BYTES)
        } as Setting<T>)
      }, 1000)
    })
  }
}
