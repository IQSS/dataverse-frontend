import {
  submitGuestbookForDatasetDownload as submitGuestbookForDatasetDownloadJSDv,
  submitGuestbookForDatafileDownload as submitGuestbookForDatafileDownloadJSDv,
  submitGuestbookForDatafilesDownload as submitGuestbookForDatafilesDownloadJSDv
} from '@iqss/dataverse-client-javascript'
import {
  AccessRepository,
  GuestbookResponseDTO
} from '@/access/domain/repositories/AccessRepository'

export class AccessJSDataverseRepository implements AccessRepository {
  submitGuestbookForDatasetDownload(
    datasetId: number | string,
    answers: GuestbookResponseDTO
  ): Promise<string> {
    return submitGuestbookForDatasetDownloadJSDv.execute(datasetId, answers)
  }

  submitGuestbookForDatafileDownload(
    fileId: number | string,
    answers: GuestbookResponseDTO
  ): Promise<string> {
    return submitGuestbookForDatafileDownloadJSDv.execute(fileId, answers)
  }

  submitGuestbookForDatafilesDownload(
    fileIds: Array<number>,
    answers: GuestbookResponseDTO
  ): Promise<string> {
    return submitGuestbookForDatafilesDownloadJSDv.execute(fileIds, answers)
  }
}
