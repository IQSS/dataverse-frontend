import { StoryFn } from '@storybook/react'
import { SettingsContext } from '../sections/settings/SettingsContext'
import { Setting, SettingName } from '../settings/domain/models/Setting'
import { SettingMother } from '../../tests/component/settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../settings/domain/models/ZipDownloadLimit'
import { FileSizeUnit } from '../files/domain/models/FilePreview'

const zipDownloadLimitMock = new ZipDownloadLimit(1, FileSizeUnit.BYTES)
export const WithSettings = (Story: StoryFn) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  function getSettingByName<T>(name: SettingName): Promise<Setting<T>> {
    switch (name) {
      case SettingName.ZIP_DOWNLOAD_LIMIT:
        return Promise.resolve(
          SettingMother.createZipDownloadLimit(zipDownloadLimitMock) as Setting<T>
        )
      case SettingName.ALLOWED_EXTERNAL_STATUSES:
        return Promise.resolve(
          SettingMother.createExternalStatusesAllowed([
            'Author Contacted',
            'Privacy Review',
            'Awaiting Paper Publication',
            'Final Approval'
          ]) as Setting<T>
        )
      case SettingName.HAS_PUBLIC_STORE:
        return Promise.resolve(SettingMother.createHasPublicStore(false) as Setting<T>)
    }
  }

  return (
    <SettingsContext.Provider value={{ getSettingByName }}>
      <Story />
    </SettingsContext.Provider>
  )
}
