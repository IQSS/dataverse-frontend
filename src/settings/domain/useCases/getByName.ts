import { SettingRepository } from '../repositories/SettingRepository'
import { Setting, SettingName } from '../models/Setting'

export async function getByName<T>(
  settingRepository: SettingRepository,
  name: SettingName
): Promise<Setting<T>> {
  return settingRepository.getByName<T>(name).catch((error: Error) => {
    throw new Error(error.message)
  })
}
