import { requireAppConfig } from '@/config'
import { Utils } from '@/shared/helpers/Utils'

export function bearerDownloadFetchInit(): RequestInit | undefined {
  const token = Utils.getLocalStorageItem<string>(
    `${requireAppConfig().oidc.localStorageKeyPrefix}token`
  )
  return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
}
