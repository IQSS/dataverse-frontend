import { PropsWithChildren, useEffect, useState } from 'react'
import { SettingsContext } from './SettingsContext'
import { Setting, SettingName } from '../../settings/domain/models/Setting'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { getZipDownloadLimit } from '@/info/domain/useCases/getZipDownloadLimit'
import { getMaxEmbargoDurationInMonths } from '@/info/domain/useCases/getMaxEmbargoDurationInMonths'
import { getHasPublicStore } from '@/info/domain/useCases/getHasPublicStore'
import { getExternalStatusesAllowed } from '@/info/domain/useCases/getExternalStatusesAllowed'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'

interface SettingsProviderProps {
  dataverseInfoRepository: DataverseInfoRepository
}

export function SettingsProvider({
  dataverseInfoRepository,
  children
}: PropsWithChildren<SettingsProviderProps>) {
  const [settings, setSettings] = useState<Setting<unknown>[]>([])
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsResponse = await Promise.all([
          getZipDownloadLimit(dataverseInfoRepository),
          getMaxEmbargoDurationInMonths(dataverseInfoRepository),
          getHasPublicStore(dataverseInfoRepository),
          getExternalStatusesAllowed(dataverseInfoRepository)
        ])

        setSettings(settingsResponse)
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setIsLoadingSettings(false)
      }
    }

    void fetchSettings()
  }, [dataverseInfoRepository])

  function getSettingByName<T>(name: SettingName): Setting<T> | undefined {
    return settings.find((setting) => setting.name === name) as Setting<T> | undefined
  }

  if (isLoadingSettings) {
    return <AppLoader />
  }

  return (
    <SettingsContext.Provider value={{ getSettingByName: getSettingByName }}>
      {children}
    </SettingsContext.Provider>
  )
}
