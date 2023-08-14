import { createContext, useContext } from 'react'
import { Setting, SettingName } from '../../settings/domain/models/Setting'

interface SettingsContextProps {
  getSettingByName: <T>(name: SettingName) => Promise<Setting<T>>
}

export const SettingsContext = createContext<SettingsContextProps>({
  getSettingByName: () => Promise.reject('Not implemented')
})
export const useSettings = () => useContext(SettingsContext)
