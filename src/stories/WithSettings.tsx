import { StoryFn } from '@storybook/react'
import { SettingsContext } from '../sections/settings/SettingsContext'
import { Setting, SettingName } from '../settings/domain/models/Setting'
import { SettingMother } from '../../tests/component/settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../settings/domain/models/ZipDownloadLimit'
import { FileSizeUnit } from '../files/domain/models/FileMetadata'

const zipDownloadLimitMock = new ZipDownloadLimit(1, FileSizeUnit.BYTES)
export const WithSettings = (Story: StoryFn) => {
  function getSettingByName<T>(name: SettingName): Setting<T> {
    switch (name) {
      case SettingName.ZIP_DOWNLOAD_LIMIT:
        return SettingMother.createZipDownloadLimit(zipDownloadLimitMock) as Setting<T>

      case SettingName.ALLOWED_EXTERNAL_STATUSES:
        return SettingMother.createExternalStatusesAllowed([
          'Author Contacted',
          'Privacy Review',
          'Awaiting Paper Publication',
          'Final Approval'
        ]) as Setting<T>

      case SettingName.HAS_PUBLIC_STORE:
        return SettingMother.createHasPublicStore(false) as Setting<T>

      case SettingName.MAX_EMBARGO_DURATION_IN_MONTHS:
        return SettingMother.createMaxEmbargoDurationInMonths(-1) as Setting<T>
      case SettingName.DATASET_PUBLISH_POPUP_CUSTOM_TEXT:
        return SettingMother.createDatasetPublishPopupCustomText(
          'This is custom text for the dataset publish popup.'
        ) as Setting<T>
      case SettingName.PUBLISH_DATASET_DISCLAIMER_TEXT:
        return SettingMother.createPublishDatasetDisclaimerText(
          'This is custom text for the publish dataset disclaimer.'
        ) as Setting<T>
      default:
        throw new Error(`No mock implementation for setting`)
    }
  }

  return (
    <SettingsContext.Provider value={{ getSettingByName }}>
      <Story />
    </SettingsContext.Provider>
  )
}
