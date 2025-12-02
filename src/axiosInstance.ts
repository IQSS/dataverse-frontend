import axios from 'axios'
import { requireAppConfig } from './config'
import { Utils } from './shared/helpers/Utils'

const appConfig = requireAppConfig()

declare module 'axios' {
  export interface AxiosRequestConfig {
    excludeToken?: boolean
  }
}

/**
 * This instance is used to make requests that we do not do through js-dataverse
 */

const axiosInstance = axios.create({
  baseURL: appConfig.backendUrl,
  withCredentials: false
})

axiosInstance.interceptors.request.use((config) => {
  if (!config.excludeToken) {
    const token = Utils.getLocalStorageItem<string>(`${appConfig.oidc.localStorageKeyPrefix}token`)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export { axiosInstance }
