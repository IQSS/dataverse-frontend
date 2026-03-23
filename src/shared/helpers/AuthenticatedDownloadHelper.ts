import axios, { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import { requireAppConfig } from '@/config'
import { Utils } from '@/shared/helpers/Utils'

const CONTENT_DISPOSITION_FILENAME_PATTERN = /filename\*?=(?:UTF-8''|")?([^";\n]+)"?/i

const getFilenameFromHeaders = (
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
): string | undefined => {
  const headerRecord = headers as Record<string, unknown>
  const contentDisposition = headerRecord['content-disposition']

  if (typeof contentDisposition !== 'string') {
    return undefined
  }

  const match = contentDisposition.match(CONTENT_DISPOSITION_FILENAME_PATTERN)
  const encodedFilename = match?.[1]

  if (encodedFilename === undefined) {
    return undefined
  }

  try {
    return decodeURIComponent(encodedFilename)
  } catch {
    return encodedFilename
  }
}

const buildAuthHeaders = (): Record<string, string> => {
  const appConfig = requireAppConfig()
  const token = Utils.getLocalStorageItem<string>(`${appConfig.oidc.localStorageKeyPrefix}token`)

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const triggerAuthenticatedDownload = async (url: string): Promise<void> => {
  // TODO: replace this helper with a public js-dataverse download use case when one exists.
  const response = await axios.get<Blob>(url, {
    responseType: 'blob',
    headers: buildAuthHeaders()
  })

  const objectUrl = URL.createObjectURL(response.data)
  const downloadLink = document.createElement('a')
  downloadLink.href = objectUrl
  downloadLink.style.display = 'none'

  const filename = getFilenameFromHeaders(response.headers)
  if (filename) {
    downloadLink.download = filename
  }

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(objectUrl)
}
