import { createContext, useContext } from 'react'
import { Setting, SettingName } from '../../settings/domain/models/Setting'

interface SettingsContextType {
  getSettingByName: <T>(name: SettingName) => Setting<T> | undefined
}

export const SettingsContext = createContext<SettingsContextType>({
  getSettingByName: <T>(_name: SettingName): Setting<T> | undefined => undefined
})

export const useSettings = () => useContext(SettingsContext)
