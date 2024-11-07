import axios from 'axios'
import { DATAVERSE_BACKEND_URL } from './config'
import { Utils } from './shared/helpers/Utils'

/**
 * This instance is used to make requests that we do not do through js-dataverse
 */

const axiosInstance = axios.create({
  baseURL: DATAVERSE_BACKEND_URL,
  withCredentials: false
})

axiosInstance.interceptors.request.use((config) => {
  const token = Utils.getLocalStorageItem<string>('ROCP_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { axiosInstance }
