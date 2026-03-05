import {
  submitGuestbookForDatasetDownload as submitGuestbookForDatasetDownloadJSDv,
  submitGuestbookForDatafileDownload as submitGuestbookForDatafileDownloadJSDv,
  submitGuestbookForDatafilesDownload as submitGuestbookForDatafilesDownloadJSDv
} from '@iqss/dataverse-client-javascript'
import {
  AccessRepository,
  GuestbookResponseAnswer
} from '@/access/domain/repositories/AccessRepository'

export class AccessJSDataverseRepository implements AccessRepository {
  submitGuestbookForDatasetDownload(
    datasetId: number | string,
    answers: GuestbookResponseAnswer[]
  ): Promise<string> {
    return submitGuestbookForDatasetDownloadJSDv.execute(datasetId, {
      guestbookResponse: { answers }
    })
  }

  submitGuestbookForDatafileDownload(
    fileId: number | string,
    answers: GuestbookResponseAnswer[]
  ): Promise<string> {
    return submitGuestbookForDatafileDownloadJSDv.execute(fileId, {
      guestbookResponse: { answers }
    })
  }

  submitGuestbookForDatafilesDownload(
    fileIds: Array<number | string>,
    answers: GuestbookResponseAnswer[]
  ): Promise<string> {
    return submitGuestbookForDatafilesDownloadJSDv.execute(fileIds, {
      guestbookResponse: { answers }
    })
  }
}
