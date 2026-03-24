import axios from 'axios'
import { requireAppConfig } from '@/config'
import { GuestbookResponseDTO } from '@/access/domain/repositories/AccessRepository'
import { Utils } from '@/shared/helpers/Utils'

const EMPTY_GUESTBOOK_RESPONSE: GuestbookResponseDTO = {
  guestbookResponse: {}
}

type SignedUrlResponse =
  | string
  | {
      signedUrl?: string
      data?: {
        signedUrl?: string
      }
    }

const getAuthToken = (): string | null => {
  const appConfig = requireAppConfig()
  return Utils.getLocalStorageItem<string>(`${appConfig.oidc.localStorageKeyPrefix}token`)
}

const buildAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken()

  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getSignedUrlFromResponse = (responseData: SignedUrlResponse): string => {
  if (typeof responseData === 'string') {
    return responseData
  }

  const signedUrl = responseData.data?.signedUrl ?? responseData.signedUrl

  if (!signedUrl) {
    throw new Error('Signed download URL not found in response')
  }

  return signedUrl
}

export const requestSignedDownloadUrl = async (url: string): Promise<string> => {
  const response = await axios.post<SignedUrlResponse>(url, EMPTY_GUESTBOOK_RESPONSE, {
    headers: buildAuthHeaders()
  })

  return getSignedUrlFromResponse(response.data)
}

export const downloadFromSignedUrl = (signedUrl: string): Promise<void> => {
  try {
    const downloadLink = document.createElement('a')
    downloadLink.href = signedUrl
    downloadLink.style.display = 'none'
    downloadLink.rel = 'noreferrer'

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
