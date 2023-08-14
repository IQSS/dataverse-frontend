import { PropsWithChildren, useState } from 'react'
import { SettingsContext } from './SettingsContext'
import { Setting, SettingName } from '../../settings/domain/models/Setting'
import { SettingRepository } from '../../settings/domain/repositories/SettingRepository'

interface SettingsProviderProps {
  repository: SettingRepository
}

export function SettingsProvider({
  repository,
  children
}: PropsWithChildren<SettingsProviderProps>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<Setting<any>[]>([])

  function getSettingByName<T>(name: SettingName): Promise<Setting<T>> {
    const setting = settings.find((setting) => setting.name === name)
    if (setting) {
      return Promise.resolve(setting as Setting<T>)
    }

    return repository.getByName<T>(name).then((setting) => {
      setSettings((settings) => [...settings, setting])
      return setting
    })
  }

  return (
    <SettingsContext.Provider value={{ getSettingByName: getSettingByName }}>
      {children}
    </SettingsContext.Provider>
  )
}
