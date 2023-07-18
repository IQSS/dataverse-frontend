import { StoryFn } from '@storybook/react'
import { SettingsContext } from '../sections/settings/SettingsContext'
import { Setting, SettingName } from '../settings/domain/models/Setting'
import { SettingMother } from '../../tests/component/settings/domain/models/SettingMother'

export const WithSettings = (Story: StoryFn) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  function getSettingByName<T>(name: SettingName): Promise<Setting<T>> {
    return Promise.resolve(SettingMother.createZipDownloadLimit() as Setting<T>)
  }

  return (
    <SettingsContext.Provider value={{ getSettingByName }}>
      <Story />
    </SettingsContext.Provider>
  )
}
