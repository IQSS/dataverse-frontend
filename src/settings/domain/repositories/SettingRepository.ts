import { Setting, SettingName } from '../models/Setting'

export interface SettingRepository {
  getByName: <T>(name: SettingName) => Promise<Setting<T>>
}
