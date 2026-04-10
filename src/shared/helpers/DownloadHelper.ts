import { submitGuestbookForDatasetDownload } from '@/access/domain/useCases/submitGuestbookForDatasetDownload'
import { submitGuestbookForDatafileDownload } from '@/access/domain/useCases/submitGuestbookForDatafileDownload'
import { submitGuestbookForDatafilesDownload } from '@/access/domain/useCases/submitGuestbookForDatafilesDownload'
import {
  AccessRepository,
  GuestbookResponseDTO
} from '@/access/domain/repositories/AccessRepository'
import { FileDownloadMode } from '@/files/domain/models/FileMetadata'

export const EMPTY_GUESTBOOK_RESPONSE: GuestbookResponseDTO = {
  guestbookResponse: {}
}

interface SignedDownloadSubmissionParams {
  accessRepository: AccessRepository
  datasetId?: number | string
  fileId?: number | string
  fileIds?: Array<number>
  guestbookResponse: GuestbookResponseDTO
  format?: string | FileDownloadMode
}

export const requestSignedDownloadUrlFromAccessApi = async ({
  accessRepository,
  datasetId,
  fileId,
  fileIds,
  guestbookResponse,
  format
}: SignedDownloadSubmissionParams): Promise<string> => {
  const datasetDownloadFormat =
    format === FileDownloadMode.ORIGINAL || format === FileDownloadMode.ARCHIVAL
      ? format
      : undefined

  if (fileId !== undefined) {
    return submitGuestbookForDatafileDownload(accessRepository, fileId, guestbookResponse, format)
  }

  if (fileIds && fileIds.length > 0) {
    return submitGuestbookForDatafilesDownload(
      accessRepository,
      fileIds,
      guestbookResponse,
      datasetDownloadFormat
    )
  }

  if (datasetId !== undefined) {
    return submitGuestbookForDatasetDownload(
      accessRepository,
      datasetId,
      guestbookResponse,
      datasetDownloadFormat
    )
  }

  throw new Error('No download target provided for signed URL request')
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
